import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.services.network_simulator import simulator
from app.services.network_monitor import monitor
from app.services.abr_engine import abr, quality_configs
from app.services.buffer_manager import buffer_mgr
from app.services.metrics_engine import metrics_eng
from app.api import network, simulation, stream, metrics, experiment

active_connections = set()

async def update_loop():
    while True:
        try:
            # 1. Get metrics
            if simulator.is_running and not simulator.is_paused:
                current_metrics = simulator.generate_metrics()
            else:
                current_metrics = monitor.get_real_metrics() or simulator.generate_metrics()

            # 2. Update buffer
            dt = 1.0
            buffer_mgr.update(current_metrics, abr.current_quality, dt)
            current_metrics.buffer_seconds = buffer_mgr.buffer_seconds

            # 3. ABR Decision
            decision = abr.decide_quality(current_metrics, buffer_mgr.buffer_seconds)
            current_metrics.quality = abr.current_quality

            # 4. Record Metrics
            metrics_eng.record(current_metrics, decision)

            # 5. Broadcast to WS
            if active_connections:
                payload = {
                    "metrics": current_metrics.dict(),
                    "stream_status": {
                        "mode": abr.mode,
                        "current_quality": abr.current_quality,
                        "current_bitrate_mbps": quality_configs[abr.current_quality]['bitrate_mbps'],
                        "buffer_seconds": buffer_mgr.buffer_seconds,
                        "is_buffering": buffer_mgr.is_buffering,
                        "playback_status": "playing" if not buffer_mgr.is_buffering else "buffering"
                    },
                    "buffer_status": buffer_mgr.get_status(),
                    "scores": {
                        "network_health": metrics_eng.calculate_network_health_score(current_metrics),
                        "quality_stability": metrics_eng.calculate_quality_stability_score()
                    },
                    "alerts": [a.dict() for a in metrics_eng.get_alerts(5)]
                }
                msg = json.dumps(payload)
                disconnected = set()
                for conn in list(active_connections):
                    try:
                        await conn.send_text(msg)
                    except Exception:
                        disconnected.add(conn)
                active_connections.difference_update(disconnected)

            await asyncio.sleep(1.0)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Error in update loop: {e}")
            await asyncio.sleep(1.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    simulator.start()
    task = asyncio.create_task(update_loop())
    yield
    # Shutdown
    task.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(network.router, prefix="/api/network", tags=["network"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["simulation"])
app.include_router(stream.router, prefix="/api/stream", tags=["stream"])
app.include_router(metrics.router, prefix="/api/metrics", tags=["metrics"])
app.include_router(experiment.router, prefix="/api/experiment", tags=["experiment"])

@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)
