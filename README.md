# Adaptive Behavioral Deception-Resistant Insider Threat Detection System

An enterprise-grade, privacy-preserving behavioral threat monitoring and detection system utilizing Machine Learning (Isolation Forest) and counterfactual digital twins to identify insider threats in real-time.

---

## 🏛️ Architecture Overview

The system consists of four coordinated components:

1. **Frontend Dashboard (`frontend/`)**: Modern React + Vite SOC (Security Operations Center) dashboard with real-time telemetry, risk visualization, employee behavior timeline, What-If counterfactual analysis sandbox, and academic research experiment suite.
2. **Backend API (`backend/`)**: Node.js & Express RESTful API managing activity logging, anomaly tracking, risk calculation, threat alerts, and automated database seeding with in-memory fallback.
3. **AI Microservice (`ai_service/`)**: Python Flask microservice leveraging Scikit-Learn Isolation Forest, baseline behavioral generators, and multi-vector Z-score drift calculation for threat anomaly scoring.
4. **Live Endpoint Agent (`agent/`)**: Lightweight, privacy-preserving background sensor tracking host telemetry (application execution, USB storage attachments, file operations, outbound network bandwidth, session timestamps) without logging keystrokes, camera feeds, or private document contents.

```
                    ┌────────────────────────┐
                    │  React SOC Dashboard   │
                    │      (Port 3000)       │
                    └───────────┬────────────┘
                                │ HTTP / REST
                    ┌───────────▼────────────┐
                    │  Node.js Backend API   │
                    │      (Port 5002)       │
                    └─────┬────────────┬─────┘
                          │            │
            Proxy / Sync  │            │ Analysis
                          ▼            ▼
┌───────────────────────────┐        ┌───────────────────────────┐
│ Live Endpoint Sensor Agent│        │   Python AI Microservice  │
│  (Workstation Telemetry)  │        │ (Isolation Forest - P5001)│
└───────────────────────────┘        └───────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: v3.10+ (with `pip`)
- **MongoDB**: Optional (automatic in-memory fallback enabled if offline)

---

### Step 1: Start the Python AI Microservice
```bash
cd ai_service
pip install -r requirements.txt
py app.py
```
> Running at: `http://127.0.0.1:5001`  
> Health check: `http://127.0.0.1:5001/health`

---

### Step 2: Start the Backend API
```bash
cd backend
npm install
npm start
```
> Running at: `http://127.0.0.1:5002`  
> Employees endpoint: `http://127.0.0.1:5002/api/employees`

---

### Step 3: Start the Frontend UI
```bash
cd frontend
npm install
npm run dev
```
> Running at: `http://localhost:3000`

---

### Step 4 (Optional): Run the Live Endpoint Monitoring Agent
```bash
cd agent
py monitor.py
```

#### Interactive Threat Simulation Commands
While `monitor.py` is running, type any of the following commands and hit `Enter` to immediately demonstrate threat detection in the React SOC dashboard:

| Command | Action | Anomaly Score |
|---|---|---|
| `usb` | Simulates high-speed USB flash drive attachment | 0.82 (Critical) |
| `files` | Automatically generates 25 confidential test files in `monitored_sandbox_folder` | 0.85 (Critical) |
| `powershell` | Simulates obfuscated administrative PowerShell execution | 0.79 (High) |
| `network` | Simulates a massive 3.8 GB outbound exfiltration transfer | 0.91 (Critical) |
| `login` | Simulates off-hours login at 03:17 AM | 0.70 (Suspicious) |
| `quit` | Cleanly stops the monitoring agent | — |

---

## 🔬 Research & Publication Files
This repository also contains research evaluation scripts, LaTeX paper sources, and experimental figures:
- `Insider_Threat_IEEE_Three_Authors.tex` / `IEEE_Conference_Paper_Insider_Threat_Detection.tex`: IEEE conference paper draft.
- `generate_zero_ai_paper.py`: Automated generator and validation script for IEEE research paper and Word doc generation.
- `fig1.png` - `fig5.png`: Research figures (Architecture, Activity distribution, Alert distribution, Experimental results).

---

## 🛡️ License
Academic Research Prototype — Cyber Security & Insider Threat Detection.
