# Project Report: Adaptive Video Streaming System
## Maintaining Quality of Service Under Dynamic Network Conditions

### 1. Abstract
The rapid growth of video consumption across diverse network environments necessitates intelligent systems that can maintain a continuous playback experience. This project presents an Adaptive Video Streaming System, simulating Adaptive Bitrate (ABR) streaming principles. The system monitors fluctuating network conditions—bandwidth, latency, packet loss, and jitter—and dynamically scales video resolution (from 360p to 1080p) to optimize Quality of Service (QoS). Built with a Python FastAPI backend and a React frontend, it successfully demonstrates hysteresis, buffer management, and heuristic-based decision-making.

### 2. Introduction
Video traffic constitutes the vast majority of modern internet bandwidth. Standard delivery mechanisms fail when users transition between networks (e.g., Wi-Fi to cellular) or face congestion, leading to video stalls. Adaptive Bitrate (ABR) streaming solves this by segmenting video into multiple quality tiers and adjusting the requested tier based on real-time capabilities. The objective of this project is to implement a functional ABR simulation to observe and visualize these network interactions and algorithmic decisions in real-time.

### 3. Literature Review
Modern streaming heavily relies on standards like MPEG-DASH and Apple HLS. Early implementations utilized simple bandwidth-estimation heuristics. More advanced solutions incorporate buffer-based logic (e.g., BOLA) or Model Predictive Control (MPC). This project implements a hybrid heuristic ABR algorithm, balancing buffer depth and estimated bandwidth while applying hysteresis to prevent oscillation.

### 4. System Design
The system architecture follows a decoupled client-server model:
- **Frontend (React):** Manages the user interface, video element, and real-time visualization dashboards.
- **Backend (FastAPI):** Houses the Network Simulator, Buffer Manager, and ABR Engine.
- **Communication:** Uses WebSocket for high-frequency (1Hz) telemetry streaming and REST for configuration.

### 5. Implementation
The application is built using React 18, Vite, and Tailwind CSS for a modern, responsive UI. The backend utilizes Python 3.10 and FastAPI to ensure high-performance asynchronous operations. Local `.mp4` files are used in place of segmented video files to simplify the local deployment while still representing distinct bitrate tiers (0.5 Mbps to 5.0 Mbps).

### 6. Algorithm Design
The core ABR algorithm relies on estimating usable bandwidth and assessing current buffer depth.
- `Estimated BW = Measured BW × 0.75` (Safety Factor)
- Target resolutions are bound by strict thresholds (e.g., >6.0 Mbps for 1080p).
- Buffer states override bandwidth rules: A critical buffer (< 2s) forces an immediate downgrade to rebuild the buffer, overriding all hysteresis timers.
- Hysteresis limits switching frequency: Upgrades require a 10s wait and progress one step at a time; downgrades allow rapid drops.

### 7. Experimental Methodology
Experiments are conducted using a controlled "Simulation Mode" providing five preset network profiles (Excellent to Very Poor). A built-in Experiment Manager automates transitions between these states over a defined timeline, recording the ABR engine's response, buffer fill rate, and total stalls. Results are compared against a "Fixed Quality" baseline.

### 8. Results and Discussion
Testing confirms the ABR engine effectively mitigates stalls during network degradation. When subjected to the "Moderate" profile, the ABR system successfully downscaled to 720p, maintaining a healthy buffer, whereas the 1080p fixed-quality stream stalled repeatedly. The implementation of hysteresis was observed successfully preventing quality oscillation when bandwidth fluctuated narrowly around a threshold.

### 9. Limitations
- The system simulates segment downloading via local file switching; it does not implement true HTTP chunked transfers like DASH/HLS.
- Simulated network metrics do not inject physical packet delay/loss into the TCP stream.
- No distributed CDN infrastructure is modeled.

### 10. Conclusion and Future Work
The project successfully visualizes and implements the fundamentals of Adaptive Bitrate streaming. It proves that a heuristic hybrid of buffer awareness and bandwidth estimation significantly improves QoS compared to static streaming. Future enhancements include implementing true MPEG-DASH segmentation, integrating Machine Learning (LSTM) for bandwidth prediction, and deploying across cloud environments.

### 11. References
- Kurose, J. F., & Ross, K. W. (2017). *Computer Networking: A Top-Down Approach.* Pearson.
- Stockhammer, T. (2011). Dynamic adaptive streaming over HTTP.
- Yin, H., et al. (2015). A control-theoretic approach for dynamic adaptive video streaming over HTTP (BOLA).
