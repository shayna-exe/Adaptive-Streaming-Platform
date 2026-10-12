from fastapi import APIRouter, Body
from app.services.abr_engine import abr, quality_configs
from app.services.buffer_manager import buffer_mgr

router = APIRouter()

@router.get("/status")
def get_stream_status():
    return {
        "mode": abr.mode,
        "current_quality": abr.current_quality,
        "current_bitrate_mbps": quality_configs[abr.current_quality]['bitrate_mbps'],
        "buffer_seconds": buffer_mgr.buffer_seconds,
        "is_buffering": buffer_mgr.is_buffering,
        "playback_status": "playing" if not buffer_mgr.is_buffering else "buffering"
    }

@router.post("/mode")
def set_mode(payload: dict = Body(...)):
    mode = payload.get("mode")
    fixed_quality = payload.get("fixed_quality")
    abr.set_mode(mode, fixed_quality)
    return {"status": "mode_set"}

@router.post("/quality")
def force_quality(payload: dict = Body(...)):
    quality = payload.get("quality")
    abr.set_mode("fixed", quality)
    return {"status": "quality_forced"}

@router.get("/decisions")
def get_decisions():
    from app.services.metrics_engine import metrics_eng
    return metrics_eng.quality_changes[-100:]

@router.get("/quality_config")
def get_quality_config():
    return quality_configs
