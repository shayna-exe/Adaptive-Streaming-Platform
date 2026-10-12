import time
from app.models.schemas import NetworkMetrics
from app.services.abr_engine import quality_configs

class BufferManager:
    def __init__(self):
        self.buffer_seconds = 10.0
        self.max_buffer = 30.0
        self.target_buffer = 15.0
        self.is_buffering = False
        self.buffering_events = []
        self.current_buffering_start = None

    def update(self, metrics: NetworkMetrics, quality: str, dt: float):
        target_bitrate = quality_configs[quality]['bitrate_mbps'] * 1e6 / 8
        available = metrics.bandwidth_mbps * 1e6 / 8

        if available > 0:
            fill_rate = (available - target_bitrate) / target_bitrate
        else:
            fill_rate = -1.0

        buffer_change = fill_rate * dt
        self.buffer_seconds = max(0.0, min(self.max_buffer, self.buffer_seconds + buffer_change))

        if self.buffer_seconds <= 0 and not self.is_buffering:
            self.is_buffering = True
            self.current_buffering_start = time.time()
        elif self.buffer_seconds > 2.0 and self.is_buffering:
            self.is_buffering = False
            if self.current_buffering_start:
                duration = time.time() - self.current_buffering_start
                self.buffering_events.append({
                    "start": self.current_buffering_start,
                    "end": time.time(),
                    "duration": duration,
                    "quality": quality,
                    "bandwidth": metrics.bandwidth_mbps
                })
                self.current_buffering_start = None

    def get_status(self):
        state = "SAFE"
        if self.is_buffering:
            state = "BUFFERING"
        elif self.buffer_seconds < 2.0:
            state = "CRITICAL"
        elif self.buffer_seconds < 5.0:
            state = "WARNING"

        return {
            "buffer_seconds": self.buffer_seconds,
            "is_buffering": self.is_buffering,
            "buffering_events_count": len(self.buffering_events),
            "buffer_state": state
        }

    def get_buffering_events(self):
        return self.buffering_events

    def reset(self):
        self.buffer_seconds = 10.0
        self.is_buffering = False
        self.buffering_events = []
        self.current_buffering_start = None

buffer_mgr = BufferManager()
