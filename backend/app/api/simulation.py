from fastapi import APIRouter, Body
from app.services.network_simulator import simulator
from app.models.schemas import CustomNetworkParams

router = APIRouter()

@router.post("/start")
def start_sim():
    simulator.start()
    return {"status": "started"}

@router.post("/stop")
def stop_sim():
    simulator.stop()
    return {"status": "stopped"}

@router.post("/pause")
def pause_sim():
    simulator.pause()
    return {"status": "paused"}

@router.post("/reset")
def reset_sim():
    simulator.reset()
    return {"status": "reset"}

@router.post("/profile")
def set_profile(payload: dict = Body(...)):
    profile = payload.get("profile")
    if profile == "random":
        simulator.start_random_fluctuation()
    else:
        simulator.set_profile(profile)
    return {"status": "profile_set", "profile": profile}

@router.post("/custom")
def set_custom(params: CustomNetworkParams):
    simulator.set_custom(params)
    return {"status": "custom_set"}

@router.get("/status")
def get_sim_status():
    return {
        "is_running": simulator.is_running,
        "is_paused": simulator.is_paused,
        "mode": simulator.mode,
        "profile": simulator.current_profile,
        "custom_params": simulator.custom_params
    }
