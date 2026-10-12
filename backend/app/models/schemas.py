from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NetworkMetrics(BaseModel):
    timestamp: str
    bandwidth_mbps: float
    latency_ms: float
    packet_loss_percent: float
    jitter_ms: float
    buffer_seconds: float
    quality: str
    network_status: str
    is_simulated: bool

class QualityDecision(BaseModel):
    timestamp: str
    previous_quality: str
    new_quality: str
    reason: str
    bandwidth_mbps: float
    buffer_seconds: float
    latency_ms: float
    packet_loss_percent: float

class SimulationProfile(BaseModel):
    name: str
    bandwidth_min: float
    bandwidth_max: float
    latency_min: float
    latency_max: float
    packet_loss_min: float
    packet_loss_max: float
    jitter_min: float
    jitter_max: float

class CustomNetworkParams(BaseModel):
    bandwidth_mbps: float
    latency_ms: float
    packet_loss_percent: float
    jitter_ms: float

class StreamStatus(BaseModel):
    mode: str
    current_quality: str
    current_bitrate_mbps: float
    buffer_seconds: float
    is_buffering: bool
    playback_status: str

class ExperimentConfig(BaseModel):
    duration_seconds: int
    scenario: str
    mode: str
    fixed_quality: Optional[str] = None

class AlertEvent(BaseModel):
    timestamp: str
    type: str
    message: str
    severity: str

class ExperimentResult(BaseModel):
    experiment_id: str
    start_time: str
    end_time: str
    duration_seconds: int
    scenario: str
    mode: str
    avg_bandwidth: float
    avg_latency: float
    avg_packet_loss: float
    avg_buffer: float
    quality_switches: int
    buffering_events: int
    total_buffering_duration: float
    avg_quality_score: float
    network_health_score: float
    quality_stability_score: float
    metrics_history: List[NetworkMetrics]
    decisions: List[QualityDecision]
    alerts: List[AlertEvent]
