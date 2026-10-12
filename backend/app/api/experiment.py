from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from app.models.schemas import ExperimentConfig
from app.services.experiment_manager import experiment_mgr

router = APIRouter()

@router.post("/start")
async def start_experiment(config: ExperimentConfig):
    await experiment_mgr.start_experiment(config)
    return {"status": "started", "experiment_id": experiment_mgr.current_experiment_id}

@router.post("/stop")
def stop_experiment():
    experiment_mgr.stop_experiment()
    return {"status": "stopped"}

@router.get("/status")
def get_status():
    import time
    progress = 0
    if experiment_mgr.is_running and experiment_mgr.current_experiment:
        elapsed = time.time() - experiment_mgr.start_time
        progress = min(100, int((elapsed / experiment_mgr.current_experiment.duration_seconds) * 100))
    return {
        "is_running": experiment_mgr.is_running,
        "progress_percent": progress,
        "current_experiment_id": experiment_mgr.current_experiment_id
    }

@router.get("/results")
def get_all_results():
    return experiment_mgr.get_all_results()

@router.get("/results/{id}")
def get_result(id: str):
    res = experiment_mgr.get_results(id)
    if not res: return {"error": "not found"}
    return res

@router.get("/results/{id}/csv")
def get_result_csv(id: str):
    import io
    content = experiment_mgr.export_experiment_csv(id)
    return StreamingResponse(io.StringIO(content), media_type="text/csv")

@router.get("/results/{id}/json")
def get_result_json(id: str):
    res = experiment_mgr.get_results(id)
    if not res: return {"error": "not found"}
    return res.dict()
