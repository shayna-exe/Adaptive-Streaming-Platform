import asyncio
import uuid
import time
from typing import Optional, List
from app.models.schemas import ExperimentConfig, ExperimentResult, NetworkMetrics
from app.services.network_simulator import simulator
from app.services.metrics_engine import metrics_eng
from app.services.buffer_manager import buffer_mgr
from app.services.abr_engine import abr
from app.utils.helpers import get_timestamp

class ExperimentManager:
    def __init__(self):
        self.current_experiment: Optional[ExperimentConfig] = None
        self.current_experiment_id: Optional[str] = None
        self.is_running = False
        self.results: List[ExperimentResult] = []
        self.experiment_task: Optional[asyncio.Task] = None
        self.start_time = 0.0

    async def start_experiment(self, config: ExperimentConfig):
        self.current_experiment_id = str(uuid.uuid4())
        self.current_experiment = config
        self.is_running = True
        
        # Reset services
        metrics_eng.history.clear()
        metrics_eng.quality_changes.clear()
        metrics_eng.alerts.clear()
        buffer_mgr.reset()
        abr.set_mode(config.mode, config.fixed_quality)
        
        self.start_time = time.time()
        self.experiment_task = asyncio.create_task(self.run_scenario(config.scenario, config.duration_seconds))

    async def run_scenario(self, scenario: str, duration: int):
        try:
            simulator.start()
            if scenario == 'stable':
                simulator.set_profile('excellent')
                await asyncio.sleep(duration)
            elif scenario == 'gradual_degradation':
                profiles = ['excellent', 'good', 'moderate', 'poor', 'very_poor']
                step = duration / len(profiles)
                for p in profiles:
                    simulator.set_profile(p)
                    await asyncio.sleep(step)
            elif scenario == 'sudden_degradation':
                simulator.set_profile('excellent')
                await asyncio.sleep(duration * 0.3)
                simulator.set_profile('very_poor')
                await asyncio.sleep(duration * 0.7)
            elif scenario == 'recovery':
                simulator.set_profile('very_poor')
                await asyncio.sleep(duration * 0.4)
                profiles = ['poor', 'moderate', 'good', 'excellent']
                step = (duration * 0.6) / len(profiles)
                for p in profiles:
                    simulator.set_profile(p)
                    await asyncio.sleep(step)
            elif scenario == 'random_fluctuation':
                simulator.start_random_fluctuation()
                await asyncio.sleep(duration)
            else:
                simulator.set_profile('excellent')
                await asyncio.sleep(duration)

            self._compile_results()
        except asyncio.CancelledError:
            pass
        finally:
            self.is_running = False
            self.current_experiment = None

    def _compile_results(self):
        hist = list(metrics_eng.history)
        if not hist:
            return
            
        avg_bw = sum(m.bandwidth_mbps for m in hist) / len(hist)
        avg_lat = sum(m.latency_ms for m in hist) / len(hist)
        avg_loss = sum(m.packet_loss_percent for m in hist) / len(hist)
        avg_buf = sum(m.buffer_seconds for m in hist) / len(hist)
        
        events = buffer_mgr.get_buffering_events()
        tot_buf_dur = sum(e['duration'] for e in events)
        
        res = ExperimentResult(
            experiment_id=self.current_experiment_id,
            start_time=get_timestamp(self.start_time),
            end_time=get_timestamp(),
            duration_seconds=self.current_experiment.duration_seconds,
            scenario=self.current_experiment.scenario,
            mode=self.current_experiment.mode,
            avg_bandwidth=avg_bw,
            avg_latency=avg_lat,
            avg_packet_loss=avg_loss,
            avg_buffer=avg_buf,
            quality_switches=len(metrics_eng.quality_changes),
            buffering_events=len(events),
            total_buffering_duration=tot_buf_dur,
            avg_quality_score=3.0, # approximation
            network_health_score=metrics_eng.calculate_network_health_score(hist[-1]),
            quality_stability_score=metrics_eng.calculate_quality_stability_score(),
            metrics_history=hist,
            decisions=metrics_eng.quality_changes.copy(),
            alerts=metrics_eng.alerts.copy()
        )
        self.results.append(res)

    def stop_experiment(self):
        if self.experiment_task:
            self.experiment_task.cancel()
        self.is_running = False

    def get_results(self, experiment_id: str) -> Optional[ExperimentResult]:
        for r in self.results:
            if r.experiment_id == experiment_id:
                return r
        return None

    def get_all_results(self) -> List[ExperimentResult]:
        return self.results

    def export_experiment_csv(self, experiment_id: str) -> str:
        res = self.get_results(experiment_id)
        if not res: return ""
        import io, csv
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Timestamp", "Bandwidth", "Quality", "Buffer"])
        for m in res.metrics_history:
            writer.writerow([m.timestamp, m.bandwidth_mbps, m.quality, m.buffer_seconds])
        return output.getvalue()

experiment_mgr = ExperimentManager()
