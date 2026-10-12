from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.metrics_engine import metrics_eng
from app.services.abr_engine import abr, quality_configs
from app.services.buffer_manager import buffer_mgr
from app.services.network_simulator import simulator

router = APIRouter()

@router.get("/current")
def get_current():
    metrics = simulator.generate_metrics()
    metrics.buffer_seconds = buffer_mgr.buffer_seconds
    metrics.quality = abr.current_quality
    return {
        "metrics": metrics,
        "stream_status": {
            "mode": abr.mode,
            "current_quality": abr.current_quality,
            "current_bitrate_mbps": quality_configs[abr.current_quality]['bitrate_mbps'],
            "buffer_seconds": buffer_mgr.buffer_seconds,
            "is_buffering": buffer_mgr.is_buffering,
            "playback_status": "playing" if not buffer_mgr.is_buffering else "buffering"
        },
        "buffer_status": buffer_mgr.get_status()
    }

@router.get("/history")
def get_history(limit: int = 300):
    return metrics_eng.get_history(limit)

@router.get("/scores")
def get_scores():
    hist = metrics_eng.get_history(1)
    metrics = hist[0] if hist else simulator.generate_metrics()
    return {
        "network_health": metrics_eng.calculate_network_health_score(metrics),
        "quality_stability": metrics_eng.calculate_quality_stability_score()
    }

@router.get("/export/csv")
def export_csv():
    import io
    content = metrics_eng.export_csv()
    return StreamingResponse(io.StringIO(content), media_type="text/csv")

@router.get("/export/json")
def export_json():
    return metrics_eng.export_json()
