import psutil
import time
import socket
from typing import Optional
from app.models.schemas import NetworkMetrics
from app.utils.helpers import get_timestamp

class NetworkMonitor:
    def __init__(self):
        self.last_bytes_recv = 0
        self.last_bytes_sent = 0
        self.last_time = time.time()
        self.last_latencies = []
        
        # Initialize counters
        try:
            counters = psutil.net_io_counters()
            self.last_bytes_recv = counters.bytes_recv
            self.last_bytes_sent = counters.bytes_sent
        except Exception:
            pass

    def get_real_metrics(self) -> Optional[NetworkMetrics]:
        try:
            current_time = time.time()
            dt = current_time - self.last_time
            if dt <= 0:
                dt = 1.0

            counters = psutil.net_io_counters()
            bytes_recv = counters.bytes_recv
            bytes_sent = counters.bytes_sent
            
            # bits per second -> Mbps
            download_mbps = max(0, (bytes_recv - self.last_bytes_recv) * 8 / (1024 * 1024) / dt)
            
            self.last_bytes_recv = bytes_recv
            self.last_bytes_sent = bytes_sent
            self.last_time = current_time

            # Measure latency by TCP connection
            lat_start = time.time()
            latency_ms = 0.0
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.5)
                sock.connect(('8.8.8.8', 53))
                latency_ms = (time.time() - lat_start) * 1000
                sock.close()
            except Exception:
                latency_ms = 500.0

            self.last_latencies.append(latency_ms)
            if len(self.last_latencies) > 5:
                self.last_latencies.pop(0)

            jitter_ms = 0.0
            if len(self.last_latencies) >= 2:
                diffs = [abs(self.last_latencies[i] - self.last_latencies[i-1]) for i in range(1, len(self.last_latencies))]
                jitter_ms = sum(diffs) / len(diffs)

            # Estimate packet loss (crude estimate)
            packet_loss = 0.0
            if counters.packets_recv > 0:
                packet_loss = min(100.0, (counters.dropin / counters.packets_recv) * 100.0)

            return NetworkMetrics(
                timestamp=get_timestamp(),
                bandwidth_mbps=download_mbps,
                latency_ms=latency_ms,
                packet_loss_percent=packet_loss,
                jitter_ms=jitter_ms,
                buffer_seconds=0.0,
                quality="",
                network_status="real",
                is_simulated=False
            )
        except Exception:
            return None

    def get_interfaces(self):
        interfaces = []
        try:
            addrs = psutil.net_if_addrs()
            for name, if_addrs in addrs.items():
                ips = [addr.address for addr in if_addrs if addr.family == socket.AF_INET]
                if ips:
                    interfaces.append({"name": name, "address": ips[0]})
        except Exception:
            pass
        return interfaces

monitor = NetworkMonitor()
