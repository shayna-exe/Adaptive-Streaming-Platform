import time
from typing import Optional
from app.models.schemas import NetworkMetrics, QualityDecision
from app.utils.helpers import get_timestamp

# Quality level definitions: name -> bitrate in Mbps and a numeric score
quality_configs = {
    '360p':  {'bitrate_mbps': 0.5,  'score': 1},
    '480p':  {'bitrate_mbps': 1.0,  'score': 2},
    '720p':  {'bitrate_mbps': 2.5,  'score': 3},
    '1080p': {'bitrate_mbps': 5.0,  'score': 4},
}
# Ordered list for stepping up/down one level at a time
quality_levels = ['360p', '480p', '720p', '1080p']


class ABREngine:
    """
    Adaptive Bitrate (ABR) Engine.

    Selects the best video quality based on:
      - Estimated available bandwidth (measured × safety_factor)
      - Current buffer level (protect buffer before chasing quality)
      - Packet loss (high loss = unstable link, avoid high bitrates)
      - Hysteresis (min dwell time prevents rapid oscillation)
    """

    def __init__(self):
        self.current_quality = '1080p'
        self.mode = 'adaptive'          # 'adaptive' or 'fixed'
        self.fixed_quality = '1080p'
        self.last_decision_time = time.time()
        self.last_maintain_record_time = time.time()
        # Minimum seconds between quality changes (hysteresis)
        self.min_dwell_time = 5.0
        # Sliding window of recent bandwidth estimates for upgrade decision
        self.upgrade_window = []
        # Safety factor: use only 75% of measured bandwidth to leave headroom
        self.safety_factor = 0.75

    def decide_quality(self, metrics: NetworkMetrics, buffer_seconds: float) -> Optional[QualityDecision]:
        current_time = time.time()

        # --- FIXED MODE: just enforce the fixed quality ---
        if self.mode == 'fixed':
            if self.current_quality != self.fixed_quality:
                decision = QualityDecision(
                    timestamp=get_timestamp(),
                    previous_quality=self.current_quality,
                    new_quality=self.fixed_quality,
                    reason="Fixed quality mode enforced",
                    bandwidth_mbps=metrics.bandwidth_mbps,
                    buffer_seconds=buffer_seconds,
                    latency_ms=metrics.latency_ms,
                    packet_loss_percent=metrics.packet_loss_percent,
                )
                self.current_quality = self.fixed_quality
                self.last_decision_time = current_time
                return decision
            return None

        # --- ADAPTIVE MODE ---
        # Step 1: Estimate conservative available bandwidth
        estimated_bw = metrics.bandwidth_mbps * self.safety_factor

        # Maintain a rolling window of the last 3 estimates (for upgrade guard)
        self.upgrade_window.append(estimated_bw)
        if len(self.upgrade_window) > 3:
            self.upgrade_window.pop(0)

        # Step 2: Classify buffer state
        is_critical = buffer_seconds < 2.0   # must downgrade immediately
        is_warning  = buffer_seconds < 5.0   # don't upgrade
        is_safe     = buffer_seconds >= 8.0  # can upgrade

        # Step 3: Select target quality based on bandwidth + packet loss
        #   These thresholds are project-defined and documented in docs/algorithm.md
        if estimated_bw > 6.0 and metrics.packet_loss_percent < 2.0 and buffer_seconds >= 5.0:
            target_quality = '1080p'
        elif estimated_bw > 3.0 and metrics.packet_loss_percent < 4.0:
            target_quality = '720p'
        elif estimated_bw > 1.5:
            target_quality = '480p'
        else:
            target_quality = '360p'

        # Step 4: Buffer override — protect buffer at all costs
        if is_critical:
            target_quality = '360p'   # immediate aggressive downgrade
        elif is_warning:
            # In warning zone: prevent upgrade, allow downgrade
            curr_score   = quality_configs[self.current_quality]['score']
            target_score = quality_configs[target_quality]['score']
            if target_score > curr_score:
                target_quality = self.current_quality  # block upgrade

        curr_score   = quality_configs[self.current_quality]['score']
        target_score = quality_configs[target_quality]['score']
        time_since_change = current_time - self.last_decision_time

        new_quality = self.current_quality
        reason = ""

        if target_score < curr_score:
            # --- DOWNGRADE ---
            # Allow immediately if buffer is critical; otherwise respect dwell time
            if is_critical or time_since_change > self.min_dwell_time:
                new_quality = target_quality
                if is_critical:
                    reason = f"Buffer critical ({buffer_seconds:.1f}s) — emergency downgrade"
                else:
                    reason = f"Estimated bandwidth ({estimated_bw:.1f} Mbps) insufficient for {self.current_quality}"

        elif target_score > curr_score:
            # --- UPGRADE (conservative) ---
            # Only upgrade if:
            #   1. Enough time has elapsed since last change (2× dwell time)
            #   2. All recent bandwidth samples support the NEXT quality level
            #   3. We only go up ONE level at a time
            if time_since_change > (self.min_dwell_time * 2) and len(self.upgrade_window) == 3:
                # Determine the next quality level (one step up from current)
                next_level_index = curr_score  # curr_score is 1-indexed, index = score-1, next = score
                if next_level_index < len(quality_levels):
                    next_quality = quality_levels[next_level_index]
                    needed_bw = quality_configs[next_quality]['bitrate_mbps'] / self.safety_factor
                    # All 3 recent samples must support the next quality
                    if all(bw > needed_bw for bw in self.upgrade_window):
                        new_quality = next_quality
                        reason = (f"Stable bandwidth ({estimated_bw:.1f} Mbps) and "
                                  f"healthy buffer ({buffer_seconds:.1f}s) — upgrading")

        # Step 5: Apply change if quality actually differs
        if new_quality != self.current_quality:
            decision = QualityDecision(
                timestamp=get_timestamp(),
                previous_quality=self.current_quality,
                new_quality=new_quality,
                reason=reason,
                bandwidth_mbps=metrics.bandwidth_mbps,
                buffer_seconds=buffer_seconds,
                latency_ms=metrics.latency_ms,
                packet_loss_percent=metrics.packet_loss_percent,
            )
            self.current_quality = new_quality
            self.last_decision_time = current_time
            return decision

        # Step 6: Periodic MAINTAIN log entry (every 10 s)
        if current_time - self.last_maintain_record_time > 10.0:
            self.last_maintain_record_time = current_time
            return QualityDecision(
                timestamp=get_timestamp(),
                previous_quality=self.current_quality,
                new_quality=self.current_quality,
                reason=f"Network stable — maintaining {self.current_quality}",
                bandwidth_mbps=metrics.bandwidth_mbps,
                buffer_seconds=buffer_seconds,
                latency_ms=metrics.latency_ms,
                packet_loss_percent=metrics.packet_loss_percent,
            )

        return None

    def set_mode(self, mode: str, fixed_quality: Optional[str] = None):
        self.mode = mode
        if fixed_quality and fixed_quality in quality_levels:
            self.fixed_quality = fixed_quality
            if mode == 'fixed':
                self.current_quality = fixed_quality

    def get_status(self) -> dict:
        return {
            "current_quality": self.current_quality,
            "mode": self.mode,
            "current_bitrate_mbps": quality_configs[self.current_quality]['bitrate_mbps'],
            "fixed_quality": self.fixed_quality,
            "safety_factor": self.safety_factor,
            "min_dwell_time": self.min_dwell_time,
        }


abr = ABREngine()
