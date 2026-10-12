import math
import random
import time
from app.models.schemas import NetworkMetrics
from app.utils.helpers import get_timestamp, clamp, smooth_transition

PROFILES = {
    'excellent': {'bw': (8, 12), 'latency': (15, 30), 'loss': (0, 0.5), 'jitter': (1, 5)},
    'good': {'bw': (5, 8), 'latency': (30, 60), 'loss': (0, 1), 'jitter': (5, 15)},
    'moderate': {'bw': (2, 5), 'latency': (60, 120), 'loss': (1, 3), 'jitter': (10, 30)},
    'poor': {'bw': (0.8, 2), 'latency': (120, 250), 'loss': (3, 7), 'jitter': (20, 50)},
    'very_poor': {'bw': (0.3, 0.8), 'latency': (200, 400), 'loss': (5, 12), 'jitter': (30, 80)}
}

class NetworkSimulator:
    def __init__(self):
        self.current_profile = 'excellent'
        self.custom_params = None
        self.is_running = True
        self.is_paused = False
        self.mode = 'profile' # profile, custom, random
        self.time_counter = 0.0
        
        # Current state values for smooth transitions
        self._curr_bw = 10.0
        self._curr_latency = 20.0
        self._curr_loss = 0.0
        self._curr_jitter = 2.0
        
        self.random_sequence = ['excellent', 'good', 'moderate', 'poor', 'very_poor', 'good']
        self.random_index = 0
        self.next_profile_change = time.time() + random.uniform(8, 15)

    def _get_target_values(self):
        if self.mode == 'custom' and self.custom_params:
            return (self.custom_params.bandwidth_mbps, self.custom_params.latency_ms,
                    self.custom_params.packet_loss_percent, self.custom_params.jitter_ms)
        
        prof_name = self.current_profile
        prof = PROFILES.get(prof_name, PROFILES['excellent'])
        
        # Add sinusoidal fluctuation and noise
        self.time_counter += 1
        base_bw = (prof['bw'][0] + prof['bw'][1]) / 2.0
        amp_bw = (prof['bw'][1] - prof['bw'][0]) / 2.0
        target_bw = base_bw + math.sin(self.time_counter / 5.0) * amp_bw + random.gauss(0, amp_bw * 0.1)
        
        base_lat = (prof['latency'][0] + prof['latency'][1]) / 2.0
        amp_lat = (prof['latency'][1] - prof['latency'][0]) / 2.0
        target_lat = base_lat + math.cos(self.time_counter / 3.0) * amp_lat + random.gauss(0, amp_lat * 0.1)
        
        base_loss = (prof['loss'][0] + prof['loss'][1]) / 2.0
        amp_loss = (prof['loss'][1] - prof['loss'][0]) / 2.0
        target_loss = base_loss + math.sin(self.time_counter / 7.0) * amp_loss + random.gauss(0, amp_loss * 0.1)
        
        base_jit = (prof['jitter'][0] + prof['jitter'][1]) / 2.0
        amp_jit = (prof['jitter'][1] - prof['jitter'][0]) / 2.0
        target_jit = base_jit + math.cos(self.time_counter / 4.0) * amp_jit + random.gauss(0, amp_jit * 0.1)
        
        return (clamp(target_bw, 0, 100), clamp(target_lat, 0, 2000), 
                clamp(target_loss, 0, 100), clamp(target_jit, 0, 1000))

    def generate_metrics(self) -> NetworkMetrics:
        if self.mode == 'random':
            if time.time() > self.next_profile_change:
                self.random_index = (self.random_index + 1) % len(self.random_sequence)
                self.current_profile = self.random_sequence[self.random_index]
                self.next_profile_change = time.time() + random.uniform(8, 15)

        if self.is_paused or not self.is_running:
            return NetworkMetrics(
                timestamp=get_timestamp(),
                bandwidth_mbps=self._curr_bw,
                latency_ms=self._curr_latency,
                packet_loss_percent=self._curr_loss,
                jitter_ms=self._curr_jitter,
                buffer_seconds=0.0,
                quality="unknown",
                network_status=self.current_profile,
                is_simulated=True
            )

        target_bw, target_lat, target_loss, target_jit = self._get_target_values()
        
        # Smooth transition (approx 3 seconds with alpha=0.3)
        self._curr_bw = smooth_transition(self._curr_bw, target_bw, 0.3)
        self._curr_latency = smooth_transition(self._curr_latency, target_lat, 0.3)
        self._curr_loss = smooth_transition(self._curr_loss, target_loss, 0.3)
        self._curr_jitter = smooth_transition(self._curr_jitter, target_jit, 0.3)

        return NetworkMetrics(
            timestamp=get_timestamp(),
            bandwidth_mbps=max(0.0, self._curr_bw),
            latency_ms=max(0.0, self._curr_latency),
            packet_loss_percent=max(0.0, self._curr_loss),
            jitter_ms=max(0.0, self._curr_jitter),
            buffer_seconds=0.0, # Filled in by main loop
            quality="", # Filled in by ABR engine
            network_status=self.current_profile,
            is_simulated=True
        )

    def set_profile(self, profile_name: str):
        if profile_name in PROFILES:
            self.current_profile = profile_name
            self.mode = 'profile'

    def set_custom(self, custom_params):
        self.custom_params = custom_params
        self.mode = 'custom'

    def start_random_fluctuation(self):
        self.mode = 'random'
        self.next_profile_change = time.time() + random.uniform(8, 15)

    def start(self): self.is_running = True; self.is_paused = False
    def stop(self): self.is_running = False
    def pause(self): self.is_paused = True
    def reset(self):
        self.current_profile = 'excellent'
        self.mode = 'profile'
        self._curr_bw = 10.0
        self._curr_latency = 20.0
        self._curr_loss = 0.0
        self._curr_jitter = 2.0
        self.is_running = True
        self.is_paused = False

simulator = NetworkSimulator()
