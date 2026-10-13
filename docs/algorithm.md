# ABR Algorithm Documentation

## Overview
Adaptive Bitrate (ABR) streaming is a technique used in video streaming where the quality of the video stream is adjusted dynamically based on the viewer's network conditions and device capabilities. It ensures minimal buffering (stalls) while maximizing video quality, providing a smooth user experience even when network speeds fluctuate.

## Network Classification
Network states are categorized by thresholds to guide the simulation and ABR logic:
- **Excellent:** Bandwidth 8-12 Mbps, Latency 15-30ms, Loss < 0.5%, Jitter < 5ms
- **Good:** Bandwidth 5-8 Mbps, Latency 30-60ms, Loss 0.5-1%, Jitter 5-15ms
- **Moderate:** Bandwidth 2-5 Mbps, Latency 60-120ms, Loss 1-3%, Jitter 10-30ms
- **Poor:** Bandwidth 0.8-2 Mbps, Latency 120-250ms, Loss 3-7%, Jitter 20-50ms
- **Very Poor (Critical):** Bandwidth < 0.8 Mbps, Latency > 250ms, Loss > 7%, Jitter > 50ms

## Bandwidth Estimation
The system calculates a conservative estimated bandwidth to prevent over-committing to high bitrates.
`Estimated BW = Measured BW × Safety Factor (0.75)`

The safety factor of 0.75 accommodates for short-term measurement noise, TCP overhead, and ensuring the buffer continues to grow rather than just maintaining a steady state.

## Quality Selection Algorithm
The algorithm determines the optimal resolution target based on estimated bandwidth and packet loss.

```text
if estimated_bw > 6.0 AND packet_loss < 2.0 AND buffer >= 5:
    target = 1080p
elif estimated_bw > 3.0 AND packet_loss < 4.0:
    target = 720p  
elif estimated_bw > 1.5:
    target = 480p
else:
    target = 360p
```

## Buffer Protection Logic
The buffer plays a critical role in overriding raw bandwidth calculations to prevent stalls.
- **CRITICAL (< 2s):** Force immediate downgrade to the lowest possible quality (360p) to quickly rebuild the buffer.
- **WARNING (2-5s):** Prevent any quality upgrades, but allow downgrades if bandwidth drops.
- **SAFE (5-8s):** Normal operation; standard bandwidth rules apply.
- **OPTIMAL (> 8s):** Allow upgrades if bandwidth is sufficient.

## Hysteresis
To prevent "thrashing" (rapidly switching back and forth between qualities, which annoys users), hysteresis introduces minimum dwell times and stability checks:
- **Downgrade Dwell Time:** Must wait at least 5 seconds before subsequent downgrades (unless buffer is CRITICAL).
- **Upgrade Dwell Time:** Must wait at least 10 seconds before an upgrade.
- **Gradual Upgrades:** Upgrades must happen one level at a time (e.g., 360p -> 480p -> 720p), requiring consistent healthy measurements, while downgrades can jump directly to 360p if needed.

## Buffer Simulation Model
The buffer fills or depletes based on the ratio between available bandwidth and the video's required bitrate.

```text
fill_rate = (available_bandwidth - required_bitrate) / required_bitrate
buffer_change = fill_rate × dt
current_buffer = max(0, min(max_buffer_size, current_buffer + buffer_change))
```
If `available_bandwidth` > `required_bitrate`, the buffer grows. If less, the buffer shrinks.

## Complete Pseudocode

```text
function decide_quality(metrics, buffer_seconds):
    estimated_bw = metrics.bandwidth * 0.75
    
    // 1. Buffer Critical Override
    if buffer_seconds < 2.0:
        return '360p'
        
    // 2. Determine Target Quality
    if estimated_bw > 6.0 and metrics.packet_loss < 2.0:
        target = '1080p'
    elif estimated_bw > 3.0 and metrics.packet_loss < 4.0:
        target = '720p'
    elif estimated_bw > 1.5:
        target = '480p'
    else:
        target = '360p'
        
    // 3. Apply Buffer Warnings
    if buffer_seconds < 5.0 and target > current_quality:
        target = current_quality // Cancel upgrade
        
    // 4. Apply Hysteresis
    if target > current_quality:
        if time_since_last_switch < 10.0:
            return current_quality
        target = current_quality + 1_level // Gradual upgrade
    elif target < current_quality:
        if time_since_last_switch < 5.0 and buffer_seconds >= 2.0:
            return current_quality
            
    return target
```

## Network Health Score Formula
Provides a standardized 0-100 metric indicating overall network viability.

```text
bw_score = min(100, bandwidth_mbps / 10 × 100)
latency_score = max(0, 100 - latency_ms / 4)
loss_score = max(0, 100 - packet_loss_percent × 10)
jitter_score = max(0, 100 - jitter_ms / 0.8)

health_score = (0.4 × bw_score) + (0.3 × latency_score) + (0.2 × loss_score) + (0.1 × jitter_score)
```
*Weight Justification:* Bandwidth heavily dictates possible video resolution. Latency dictates request-response delay for segments. Loss directly impacts throughput due to TCP retransmissions. Jitter impacts consistency but is buffered against.

## Quality Stability Score
Evaluates the user's Quality of Experience (QoE) based on smoothness.

```text
score = 100 - (quality_switches × 5) - (buffering_duration × 10) - max(0, (5 - avg_buffer) × 3)
```
Penalizes the system heavily for buffering stalls and frequent quality switches.
