# AdaptiveStream
### Adaptive Video Streaming Under Dynamic Network Conditions

**AdaptiveStream** is a web-based application that demonstrates how adaptive bitrate streaming can help maintain video playback quality when network conditions change. It combines a React frontend with a FastAPI backend to visualize streaming behavior, simulate network conditions, and monitor quality-of-service metrics.

The project focuses on the relationship between available bandwidth, playback buffer conditions, video quality, and buffering. It provides an interactive environment for observing how an adaptive streaming system responds to changes in network performance.

**Live Demo:** [AdaptiveStream](https://adaptive-streaming-platform-eosin.vercel.app/)

**Repository:** [GitHub](https://github.com/shayna-exe/Adaptive-Streaming-Platform)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Adaptive Bitrate Streaming](#adaptive-bitrate-streaming)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Network Simulation and Evaluation](#network-simulation-and-evaluation)
- [Frontend and Backend Integration](#frontend-and-backend-integration)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)

---

## Overview

Video streaming applications operate under changing network conditions. A video that plays smoothly on a high-speed connection may experience buffering or reduced playback quality when bandwidth decreases or network congestion increases.

Adaptive bitrate streaming addresses this challenge by selecting an appropriate video quality based on available network conditions and playback requirements.

AdaptiveStream demonstrates this concept through a video player, a backend responsible for streaming-related logic, network simulation, and a dashboard for monitoring relevant metrics.

The application uses a set of prepared video representations at different resolutions to demonstrate how quality selection can respond to changes in network conditions.

## Problem Statement

Network conditions can fluctuate because of bandwidth limitations, congestion, latency, and changes in connectivity. These variations can affect video playback, resulting in buffering, interruptions, or inconsistent visual quality.

A streaming system must balance video quality against the risk of playback interruption.

AdaptiveStream explores this problem by providing a controlled environment in which network conditions can be varied and the resulting streaming behavior can be observed.

## Objectives

- Demonstrate adaptive bitrate streaming under changing network conditions.
- Explore the relationship between bandwidth, buffer state, and playback quality.
- Simulate network degradation and recovery scenarios.
- Visualize streaming metrics through an interactive dashboard.
- Demonstrate communication between a React frontend and a Python backend.
- Provide an environment for observing and evaluating adaptive streaming behavior.

## Features

### 1. Video Playback

The application includes a video player that uses prepared video representations at different resolutions.

The available quality levels include:

- 360p
- 480p
- 720p
- 1080p

These representations provide a controlled way to demonstrate quality selection and switching.

### 2. Adaptive Bitrate Streaming

Adaptive bitrate streaming, or ABR, selects an appropriate video quality based on information such as estimated bandwidth and playback buffer conditions.

The project's ABR logic is designed to balance playback continuity with video quality.

### 3. Network Simulation

The network simulation component allows different network conditions to be examined in a controlled environment.

Scenarios involving reduced bandwidth, degraded conditions, and recovery can be used to observe how streaming decisions respond.

### 4. Buffer Monitoring

Buffer-related information helps illustrate the relationship between available buffered video and the risk of playback interruption.

The buffer management component works alongside the streaming logic to support quality-selection decisions.

### 5. Streaming Metrics and Dashboard

The frontend presents streaming-related information through dashboard components and visualizations.

Depending on the active feature and available measurements, the application can display network conditions, video quality, buffer information, and streaming-related metrics.

### 6. Experimentation and Comparison

The project includes experiment-related functionality for examining streaming behavior under different conditions.

This supports comparisons between scenarios and helps demonstrate the purpose of adaptive quality selection.

---

## System Architecture

AdaptiveStream follows a client-server architecture.

```text
             USER
               |
               v
     +----------------------+
     |    React Frontend    |
     |                      |
     | Dashboard            |
     | Video Player         |
     | Metrics and Charts   |
     | User Interactions    |
     +----------------------+
               |
        HTTP / REST API
               |
         WebSocket
               |
               v
     +----------------------+
     |    FastAPI Backend   |
     |                      |
     | API Routes           |
     | ABR Engine           |
     | Buffer Management    |
     | Network Simulation  |
     | Metrics Collection   |
     | Experiment Logic     |
     +----------------------+
               |
               v
     +----------------------+
     | Prepared Video Data  |
     | and Streaming Logic  |
     +----------------------+
```

### Frontend

The frontend is responsible for the user interface, video playback, dashboard visualizations, and presentation of streaming information.

It sends requests to the backend and displays the resulting information to the user.

### Backend

The backend is implemented using FastAPI. It provides API endpoints and contains the application logic for the streaming-related components.

The backend includes modules for adaptive bitrate decisions, buffer management, network simulation, metrics, and experiments.

### Communication

The frontend and backend communicate through HTTP requests and REST APIs for request-response operations. WebSockets are used where continuous updates are required.

This separation allows the interface and the streaming logic to be developed and maintained independently.

---

## Adaptive Bitrate Streaming

Adaptive bitrate streaming is a technique in which video quality changes according to available network conditions and playback requirements.

For example:

| Network and buffer conditions | Possible quality decision |
|---|---|
| Sufficient bandwidth and a healthy buffer | Maintain or increase quality |
| Reduced bandwidth | Consider a lower quality |
| Critically low buffer | Favor playback continuity |
| Improving network conditions | Increase quality cautiously |

The actual decision depends on the project's implemented ABR rules and current conditions.

### Why is ABR useful?

Without adaptive quality selection, a video representation that requires more bandwidth than the network can sustain may cause repeated buffering.

Selecting a more suitable representation can reduce this risk while preserving as much visual quality as the network allows.

AdaptiveStream demonstrates these principles through prepared video representations and controlled network scenarios.

---

## Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface and application components |
| Frontend tooling | Vite | Development server and production build |
| Backend | Python | Streaming-related application logic |
| API framework | FastAPI | HTTP API endpoints |
| API communication | REST over HTTP | Frontend-backend request-response communication |
| Real-time communication | WebSockets | Continuous updates where implemented |
| Video playback | HTML5 video | Browser-based video playback |
| Data visualization | Frontend chart components | Presentation of streaming metrics |
| Backend server | Uvicorn | Running the FastAPI application |
| Version control | Git and GitHub | Source code management |
| Deployment | Vercel and Render | Hosting the frontend and backend |

---

## Project Structure

The repository is organized into frontend, backend, data, and documentation directories.

```text
Adaptive-Streaming-Platform/
|
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- routers/
|   |   |-- schemas/
|   |   |-- abr_engine.py
|   |   |-- buffer_manager.py
|   |   |-- network_simulator.py
|   |   |-- metrics_engine.py
|   |   |-- experiment_manager.py
|   |
|   |-- tests/
|   |-- requirements.txt
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   |-- index.html
|
|-- data/
|-- docs/
|-- .gitignore
|-- README.md
|-- run_project.bat
```

The exact contents may vary as the project develops. The backend modules are responsible for streaming-related logic, while the frontend contains the application interface and its components.

---

## Getting Started

Follow these steps to run the application locally on Windows.

### Prerequisites

Install the following:

- Python 3.10 or a compatible version supported by the project's dependencies.
- Node.js and npm.
- Git.

Verify your installations:

```powershell
python --version
node --version
npm --version
git --version
```

### 1. Clone the Repository

Open PowerShell or a terminal and run:

```powershell
git clone https://github.com/shayna-exe/Adaptive-Streaming-Platform.git
```

Navigate to the project directory:

```powershell
cd Adaptive-Streaming-Platform
```

### 2. Set Up the Backend

Navigate to the backend directory:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell prevents activation because of its execution policy, use Command Prompt and run:

```cmd
venv\Scripts\activate.bat
```

Install the backend dependencies:

```powershell
python -m pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --reload
```

The backend should be available at:

```text
http://127.0.0.1:8000
```

Keep this terminal open while using the application.

### 3. Set Up the Frontend

Open a second terminal from the project root.

Navigate to the frontend directory:

```powershell
cd frontend
```

Install the dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite will display the local address in the terminal. The default address is:

```text
http://localhost:5173
```

Open that address in your browser.

---

## Running the Application

For local development, both the backend and frontend should be running simultaneously.

| Service | Default address |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://127.0.0.1:8000` |
| FastAPI interactive documentation | `http://127.0.0.1:8000/docs` |

If the frontend cannot communicate with the backend, verify the API base URL, WebSocket URL, CORS configuration, and that the backend server is running.

The project also includes a `run_project.bat` file. Its exact behavior depends on its current implementation.

---

## API Documentation

FastAPI provides interactive API documentation for inspecting the backend's available endpoints.

After starting the backend, open:

```text
http://127.0.0.1:8000/docs
```

The documentation allows you to inspect available routes, view request and response schemas, and test supported API operations.

The available endpoints depend on the current backend implementation. Refer to the interactive documentation rather than assuming that an endpoint exists.

---

## Network Simulation and Evaluation

Network simulation provides a controlled way to examine how streaming behavior changes under different conditions.

Suggested scenarios for evaluating the project include:

1. **Stable network:** Observe quality selection when bandwidth is sufficient.
2. **Bandwidth reduction:** Reduce available bandwidth and observe the system's response.
3. **Buffer pressure:** Examine quality decisions when the playback buffer becomes low.
4. **Network recovery:** Restore better network conditions and observe whether quality improves.
5. **Adaptive versus fixed quality:** Compare the behavior of adaptive selection with a fixed-quality scenario, where supported.

### Metrics to examine

- Available or estimated bandwidth.
- Current video quality.
- Buffer state.
- Buffering events, where measured.
- Quality switches.
- Latency or other network metrics exposed by the application.

Use actual application measurements when evaluating results. Numerical improvements should only be reported after running the relevant experiments and recording their outcomes.

---

## Frontend and Backend Integration

The frontend is the main interaction layer of AdaptiveStream. It presents the video player, dashboard, and streaming information.

The backend handles the corresponding application logic and provides data through APIs.

### HTTP and REST APIs

HTTP request-response communication is appropriate for operations in which the frontend sends a request and receives a response, such as retrieving information or invoking a supported backend operation.

FastAPI exposes these operations through the application's API routes.

### WebSockets

WebSockets maintain a persistent connection between the frontend and backend. They are useful for continuous updates when the application needs to display changing metrics without relying entirely on repeated HTTP requests.

The actual information transmitted depends on the implemented WebSocket handlers.

---

## Limitations

AdaptiveStream is an educational prototype for demonstrating adaptive streaming concepts. Its capabilities depend on the implemented video sources, backend logic, and available measurements.

- The default demonstration uses prepared video representations.
- A video player does not automatically support every URL found on the internet.
- Streaming a video from a third-party website requires compatible playback access and may be restricted by authentication, CORS, DRM, or the website's embedding policies.
- A single video file does not automatically provide multiple quality levels. Multiple representations or an appropriate transcoding and packaging pipeline are required for adaptive playback.
- Network simulation provides controlled test conditions and should not be confused with measurements from a real network.
- Results depend on the scenarios executed and the metrics actually collected.

---

## Future Enhancements

Potential future improvements include:

- Supporting user-provided direct video URLs where compatible.
- Adding HLS and DASH playback for supported streams.
- Adding a video transcoding and packaging pipeline to generate multiple representations.
- Improving real-time metrics and experiment reporting.
- Expanding evaluation across different network conditions.
- Adding automated tests for ABR decisions and frontend-backend integration.
- Improving the reproducibility of experiments and performance comparisons.

These are potential extensions and should not be interpreted as features already implemented.

---

## Running and Development Notes

- Keep the frontend and backend dependencies installed in their respective directories.
- Do not commit virtual environments, `node_modules`, generated build files, or local secrets.
- Keep production API and WebSocket configuration separate from local development settings.
- Consult the current source code and FastAPI documentation when verifying available endpoints.

For questions or issues, use the repository's GitHub Issues section.

**Repository:** https://github.com/shayna-exe/Adaptive-Streaming-Platform
