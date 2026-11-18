# Live Endpoint Monitoring Agent

The **Live Endpoint Behavioral Monitoring Agent** is a lightweight, privacy-preserving background sensor designed to monitor an authorized employee workstation and stream behavioral telemetry to the SOC Backend API in real time.

---

## 🔒 Privacy-Preserving Architecture
Unlike keyloggers or invasive surveillance tools, this agent:
- ❌ **Does NOT log keystrokes** (passwords, private chat messages).
- ❌ **Does NOT capture screenshots or camera feed**.
- ❌ **Does NOT read or inspect private document contents**.
- ✅ **Monitors system behavioral metadata**:
  - Application execution events (Chrome, Excel, PowerShell, VS Code)
  - Removable USB mass storage attachment / detachment
  - Bulk file activity in designated monitored sandbox directories
  - Outbound network throughput bursts (MB/min)
  - Off-hours authentication / session timestamps

---

## 🚀 How to Run the Agent

### Step 1: Ensure Backend is Running
The Node.js backend must be running on port 5002:
```bash
cd backend
npm start
```

### Step 2: Start the Monitoring Agent
Open a separate terminal window:
```bash
cd agent
py monitor.py
```

### Options:
```bash
# Monitor a specific employee (default: EMP-8021)
py monitor.py --emp EMP-8021

# Change polling frequency to every 3 seconds
py monitor.py --interval 3

# Specify custom backend URL
py monitor.py --url http://127.0.0.1:5002/api/activities
```

---

## 🎯 Live Demonstration & Viva Testing Shortcuts
While `monitor.py` is running in your terminal, you can type any of the following interactive shortcuts followed by `Enter` to immediately demonstrate threat detection in the React dashboard:

| Command | Action | Anomaly Score |
|---|---|---|
| `usb` | Simulates high-speed USB flash drive attachment | 0.82 (Critical) |
| `files` | Automatically generates 25 confidential test files in `monitored_sandbox_folder` | 0.85 (Critical) |
| `powershell` | Simulates obfuscated administrative PowerShell execution | 0.79 (High) |
| `network` | Simulates a massive 3.8 GB outbound exfiltration transfer | 0.91 (Critical) |
| `login` | Simulates off-hours login at 03:17 AM | 0.70 (Suspicious) |
| `quit` | Cleanly stops the monitoring agent | — |

When you trigger these, switch to the web browser:
1. Open **Employee Directory** -> Click **EMP-8021 (Dr. Sarah Vance)**.
2. Observe the **Activity History & Timeline** updating automatically in real time!
