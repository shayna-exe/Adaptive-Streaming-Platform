from fastapi import APIRouter
from app.services.network_monitor import monitor
from app.services.metrics_engine import metrics_eng
from app.services.network_simulator import simulator

router = APIRouter()

@router.get("/status")
def get_status():
    if simulator.is_running and not simulator.is_paused:
        metrics = simulator.generate_metrics()
    else:
        metrics = monitor.get_real_metrics()
    return metrics

@router.get("/interfaces")
def get_interfaces():
    return monitor.get_interfaces()

@router.get("/history")
def get_history():
    return metrics_eng.get_history()

@router.get("/alerts")
def get_alerts():
    return metrics_eng.get_alerts()
