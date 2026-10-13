# System Architecture

## Overview
AdaptiveStream uses a modular client-server architecture designed to simulate and visualize adaptive bitrate video streaming. 
The system comprises a React-based frontend providing a user interface and real-time visualization, and a FastAPI-based backend written in Python that handles network monitoring, algorithmic decision-making, and metrics aggregation. 

## Component Diagram
```
+-------------------------------------------------------------+
|                        FRONTEND (React)                     |
|                                                             |
|  +--------------+   +---------------+   +----------------+  |
|  |  Dashboard   |   | Video Player  |   |   Analytics    |  |
|  +--------------+   +---------------+   +----------------+  |
|         ^                   ^                   ^           |
|         |                   |                   |           |
|  +-------------------------------------------------------+  |
|  |                     API Services                      |  |
|  |             (REST Fetch + WebSocket Hooks)            |  |
|  +-------------------------------------------------------+  |
+---------|-------------------|-------------------|-----------+
          | (REST APIs)       | (WebSocket Stream)|
+---------v-------------------v-------------------v-----------+
|                        BACKEND (FastAPI)                    |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                  Router / Controller                  |  |
|  +-------------------------------------------------------+  |
|         |                   |                   |           |
|  +--------------+   +---------------+   +----------------+  |
|  | ABR Engine   |<--| Network Monitor/|   | Buffer       |  |
|  |              |   | Simulator       |   | Manager      |  |
|  +--------------+   +---------------+   +----------------+  |
|         |                   |                   |           |
|  +-------------------------------------------------------+  |
|  |                  Metrics Engine                       |  |
|  +-------------------------------------------------------+  |
|                             |                               |
|                     [ Local Storage ]                       |
+-------------------------------------------------------------+
```

## Frontend Architecture
The React application (scaffolded via Vite) acts as the presentation layer. It manages client-side routing using `React Router 6`. 
- **Components:** Modular UI elements created using Tailwind CSS. Contains reusable charts built via `Recharts`.
- **Hooks:** Custom hooks (`useWebSocket`, `useMetrics`) manage state synchronization. `useWebSocket` connects to the backend and continuously updates metrics for live rendering.
- **Services (`api.js`):** Centralizes all `fetch()` calls to the backend REST endpoints to control network modes, initiate experiments, and retrieve history.

## Backend Architecture
The backend is built with `FastAPI` (Python) and served via `Uvicorn`.
- **Routers:** Modular endpoints separated by domain (`/api/network`, `/api/stream`, `/api/metrics`, `/api/experiment`).
- **Global State:** Maintains the active state of the network, buffer, and current playback metrics in memory.
- **WebSocket:** An asynchronous endpoint (`/ws/metrics`) pushes updated system state to all connected clients every second.

## Communication
- **REST:** Used for control operations, fetching historical data, configuration, and starting experiments.
- **WebSocket:** Used for pushing a continuous, 1-second interval stream of network metrics and quality decisions to the frontend for real-time visualization.

## Data Flow
1. **Network Evaluation:** NetworkSimulator generates metrics (or NetworkMonitor captures them).
2. **Algorithmic Decision:** The ABR engine evaluates the new metrics alongside the current buffer state to decide the next video quality.
3. **Buffer Management:** The Buffer manager updates the virtual buffer size based on the chosen quality's bitrate vs available bandwidth.
4. **Metrics Recording:** The Metrics engine logs the latest state (bandwidth, latency, buffer, selected quality).
5. **Client Update:** The WebSocket server pushes the complete metrics package to the React frontend.
6. **UI Render:** Frontend components (charts, player, dashboard) reactively update to display the new state.

## Service Architecture

### NetworkSimulator
Responsible for generating pseudo-random network metric values (bandwidth, latency, packet loss, jitter) bound by the currently selected network profile.

### NetworkMonitor
A psutil-based service that, when enabled, samples actual hardware network interfaces to determine real-world bandwidth utilization and estimates packet loss/latency.

### ABREngine
The core algorithmic component. Maintains hysteresis state to prevent thrashing and implements rules to select between 360p, 480p, 720p, and 1080p based on safe bandwidth bounds and buffer levels.

### BufferManager
Simulates a video buffer. Calculates fill rate based on the delta between available network bandwidth and the bitrate of the currently selected video quality. Limits buffer size and handles starvation states.

### MetricsEngine
Aggregates data from the network, ABR, and buffer services. Responsible for calculating the `Network Health Score` and logging historical data to support CSV exports and analytics.

### ExperimentManager
Handles predefined, timed test scenarios (e.g., oscillating network conditions). It temporarily overrides user-selected network profiles to track the ABR's performance under rigorous scripted conditions.
