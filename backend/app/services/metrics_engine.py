import time
from collections import deque
import csv
import io
from typing import Optional, List
from app.models.schemas import NetworkMetrics, QualityDecision, AlertEvent
from app.utils.helpers import get_timestamp

class MetricsEngine:
    def __init__(self):
        self.history = deque(maxlen=3600)
        self.alerts: List[AlertEvent] = []
        self.quality_changes: List[QualityDecision] = []

    def record(self, metrics: NetworkMetrics, decision: Optional[QualityDecision]):
        self.history.append(metrics)
        if decision:
            self.quality_changes.append(decision)

        # Generate alerts
        if metrics.bandwidth_mbps < 1.0:
            self._add_alert("Warning", "Network degradation detected")
        if metrics.buffer_seconds < 3.0:
            self._add_alert("Critical", "Buffer level critical")
        
        if decision:
            quality_scores = {'360p': 1, '480p': 2, '720p': 3, '1080p': 4}
            prev_score = quality_scores.get(decision.previous_quality, 0)
            new_score  = quality_scores.get(decision.new_quality, 0)
            if new_score < prev_score:
                self._add_alert("Warning", f"Video quality reduced to {decision.new_quality} — {decision.reason}")
            elif new_score > prev_score:
                self._add_alert("Info", f"Video quality increased to {decision.new_quality}")

    def _add_alert(self, severity: str, message: str):
        # avoid spamming same alert
        if self.alerts and self.alerts[-1].message == message and severity != "Critical":
            return
        self.alerts.append(AlertEvent(
            timestamp=get_timestamp(),
            type="Network" if "Network" in message else "Playback",
            message=message,
            severity=severity
        ))

    def classify_network(self, metrics: NetworkMetrics) -> str:
        score = self.calculate_network_health_score(metrics)
        if score > 80: return "EXCELLENT"
        if score > 60: return "GOOD"
        if score > 40: return "MODERATE"
        if score > 20: return "POOR"
        return "CRITICAL"

    def calculate_network_health_score(self, metrics: NetworkMetrics) -> float:
        bw_score = min(100.0, metrics.bandwidth_mbps / 10.0 * 100.0)
        latency_score = max(0.0, 100.0 - metrics.latency_ms / 4.0)
        loss_score = max(0.0, 100.0 - metrics.packet_loss_percent * 10.0)
        jitter_score = max(0.0, 100.0 - metrics.jitter_ms / 0.8)
        return 0.4*bw_score + 0.3*latency_score + 0.2*loss_score + 0.1*jitter_score

    def calculate_quality_stability_score(self, window_seconds=60) -> float:
        # In actual implementation we'd filter by window, simplified here
        switches = len(self.quality_changes[-10:]) # approximation
        buffering_duration = 0 # would get from buffer_manager
        avg_buffer = 10.0
        if self.history:
            avg_buffer = sum(m.buffer_seconds for m in list(self.history)[-60:]) / min(60, len(self.history))
        
        score = 100.0 - (switches * 5.0) - (buffering_duration * 10.0) - max(0.0, (5.0 - avg_buffer) * 3.0)
        return max(0.0, min(100.0, score))

    def get_history(self, limit=300) -> list:
        return list(self.history)[-limit:]

    def get_alerts(self, limit=50) -> list:
        return self.alerts[-limit:]

    def export_csv(self) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Timestamp", "Bandwidth(Mbps)", "Latency(ms)", "PacketLoss(%)", "Jitter(ms)", "Buffer(s)", "Quality", "Status", "Simulated"])
        for m in self.history:
            writer.writerow([m.timestamp, m.bandwidth_mbps, m.latency_ms, m.packet_loss_percent, m.jitter_ms, m.buffer_seconds, m.quality, m.network_status, m.is_simulated])
        return output.getvalue()

    def export_json(self) -> dict:
        return {"history": [m.dict() for m in self.history]}

metrics_eng = MetricsEngine()
