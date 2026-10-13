# Testing Documentation

## Test Environment Setup
To run tests manually, ensure the Python backend environment is initialized and dependencies are installed. Automated testing leverages simple Python assertions against the core ABR logic to validate expected outcomes.

## Test Cases

### Test 1: High Bandwidth → 1080p
- **Setup:** Set simulator to Excellent (8-12 Mbps), buffer > 5s.
- **Expected:** ABR selects 1080p within the hysteresis window.
- **Pass criteria:** Quality indicator successfully transitions to 1080p.

### Test 2: Medium Bandwidth → 720p
- **Setup:** Set simulator to Moderate (2-5 Mbps).
- **Expected:** ABR selects 720p.
- **Pass criteria:** Target quality settles and remains at 720p.

### Test 3: Low Bandwidth → 480p/360p
- **Setup:** Set simulator to Poor (0.8-2 Mbps).
- **Expected:** 480p or 360p selected based on the exact BW estimation.
- **Pass criteria:** Quality avoids stalling by dropping down to 480p/360p.

### Test 4: Critical Buffer Triggers Downgrade
- **Setup:** Set Very Poor network, artificially lower buffer to < 2s.
- **Expected:** Immediate quality downgrade regardless of hysteresis dwell time.
- **Pass criteria:** System ignores dwell time and switches immediately.

### Test 5: High Packet Loss Prevents Upgrade
- **Setup:** Moderate network bandwidth but with high loss (>4%).
- **Expected:** No upgrade to 1080p despite sufficient raw bandwidth.
- **Pass criteria:** Quality capped at 720p or lower due to TCP retransmission risk.

### Test 6: Network Recovery → Gradual Upgrade
- **Setup:** Start on Poor (running at 360p), switch immediately to Excellent.
- **Expected:** 360p → 480p → 720p → 1080p sequence (not 360p → 1080p instantly).
- **Pass criteria:** Adheres to the one-level-at-a-time upgrade rule.

### Test 7: Hysteresis Prevents Oscillation
- **Setup:** Provide borderline bandwidth that fluctuates just above and below a threshold.
- **Expected:** Quality does not rapidly switch back and forth.
- **Pass criteria:** Maximum one switch per 5-10 second dwell window.

### Test 8: Missing Video File
- **Setup:** Delete or rename `video_720p.mp4` from the `frontend/public/videos/` directory.
- **Expected:** UI player detects missing source.
- **Pass criteria:** Player shows an informative fallback message instead of crashing the app.
