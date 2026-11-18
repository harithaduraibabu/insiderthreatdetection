#!/usr/bin/env python3
"""
Live Workstation Behavioral Telemetry Agent (agent/monitor.py)
--------------------------------------------------------------
Pure hardware/OS monitoring sensor.
Collects 100% REAL telemetry from your actual laptop hardware:
- Real newly launched processes (Chrome, Excel, PowerShell, VS Code, etc.)
- Real physical USB flash drive insertions (verified via Windows kernel GetDriveTypeW)
- Real network throughput deltas (bytes sent over active Wi-Fi/Ethernet interfaces)

No fake records. No hardcoded simulation triggers.
"""

import os
import sys
import time
import json
import socket
import argparse
import functools
from datetime import datetime
import urllib.request
import urllib.error

# Force unbuffered output so terminal updates instantly
print = functools.partial(print, flush=True)

# Ensure user-installed site-packages are on sys.path
import site
for p in [site.getusersitepackages(), site.getuserbase()]:
    if p and p not in sys.path and os.path.exists(p):
        sys.path.insert(0, p)

appdata_base = os.path.expandvars(r"%APPDATA%\Python")
if os.path.exists(appdata_base):
    for sub in os.listdir(appdata_base):
        sp = os.path.join(appdata_base, sub, "site-packages")
        if os.path.exists(sp) and sp not in sys.path:
            sys.path.insert(0, sp)

try:
    import psutil
except Exception as e:
    print(f"[ERROR] Could not import psutil: {e}")
    print("Please install psutil with: py -m pip install psutil")
    sys.exit(1)

# Windows kernel API for strict physical drive type verification
import ctypes
def is_real_removable_usb(drive_path):
    """
    Returns True ONLY if the drive is a genuine removable physical USB/flash device.
    DRIVE_REMOVABLE = 2 (USB thumb drive, flash card)
    DRIVE_FIXED = 3 (Internal HDD/SSD C:, D:)
    """
    try:
        # Normalize drive path e.g. "E:\\"
        root = os.path.splitdrive(drive_path)[0] + "\\"
        drive_type = ctypes.windll.kernel32.GetDriveTypeW(root)
        return drive_type == 2
    except Exception:
        return False


DEFAULT_API_URL = "http://127.0.0.1:5002/api/activities"
DEFAULT_EMPLOYEE = "EMP-001"

# Recognized process categories and risk indicators
SUSPICIOUS_APPS = {
    'powershell.exe': ('App Exec', 'PowerShell console launched', 0.60),
    'cmd.exe':        ('App Exec', 'Command Prompt shell executed', 0.35),
    'tor.exe':        ('Network Traffic', 'Tor browser process active', 0.85),
    'wireshark.exe':  ('Network Traffic', 'Packet capture tool active', 0.75),
}

STANDARD_APPS = {
    'chrome.exe':  ('Chrome', 'Google Chrome browser session active', 0.05),
    'msedge.exe':  ('Chrome', 'Microsoft Edge browser session active', 0.05),
    'excel.exe':   ('Excel', 'Microsoft Excel spreadsheet active', 0.10),
    'code.exe':    ('App Exec', 'Visual Studio Code active', 0.05),
    'notepad.exe': ('File Access', 'Notepad text editor active', 0.05),
}


class RealEndpointSensor:
    def __init__(self, api_url=DEFAULT_API_URL, employee_id=DEFAULT_EMPLOYEE, interval=3):
        self.api_url = api_url
        self.employee_id = employee_id
        self.interval = interval
        self.hostname = socket.gethostname()

        # Take initial snapshot of already-running processes
        self.seen_pids = set()
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                self.seen_pids.add(proc.info['pid'])
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass

        # Take initial snapshot of existing disk partitions
        self.known_drives = set()
        for part in psutil.disk_partitions(all=False):
            self.known_drives.add(part.device)

        # Initialize network counters
        net = psutil.net_io_counters()
        self.last_net_bytes = net.bytes_sent
        self.last_net_time = time.time()

    def send_event(self, activity_type, details, anomaly_score=0.05, is_deception=False):
        """Transmit real observed event to SOC Backend API."""
        payload = {
            "employeeId": self.employee_id,
            "activityType": activity_type,
            "details": details,
            "anomalyScore": round(float(anomaly_score), 2),
            "isDeceptionTarget": bool(is_deception),
            "location": f"Host: {self.hostname}"
        }

        try:
            req = urllib.request.Request(
                self.api_url,
                data=json.dumps(payload).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status in (200, 201):
                    timestamp = datetime.now().strftime("%H:%M:%S")
                    print(f"  [{timestamp}] Logged: {activity_type:<16} | {details}")
                    return True
        except urllib.error.URLError as e:
            print(f"  [!] Failed to transmit to {self.api_url}: {e.reason}")
        except Exception as e:
            print(f"  [!] Error: {e}")
        return False

    def check_real_usb_events(self):
        """
        Check if an actual physical USB drive was plugged in or removed.
        Uses kernel GetDriveTypeW == 2 (DRIVE_REMOVABLE).
        """
        try:
            current_drives = set()
            for part in psutil.disk_partitions(all=False):
                current_drives.add(part.device)

                # Check newly connected drive
                if part.device not in self.known_drives:
                    if is_real_removable_usb(part.device):
                        self.send_event(
                            activity_type="USB Connected",
                            details=f"Physical USB flash drive inserted at mountpoint ({part.device})",
                            anomaly_score=0.75,
                            is_deception=True
                        )

            # Check removed drive
            removed = self.known_drives - current_drives
            for r in removed:
                self.send_event(
                    activity_type="USB Connected",
                    details=f"Drive disconnected from mountpoint ({r})",
                    anomaly_score=0.10,
                    is_deception=False
                )

            self.known_drives = current_drives
        except Exception:
            pass

    def check_real_process_events(self):
        """Check for newly launched software processes on your laptop."""
        try:
            current_pids = set()
            for proc in psutil.process_iter(['pid', 'name']):
                try:
                    pid = proc.info['pid']
                    name = (proc.info['name'] or '').lower()
                    current_pids.add(pid)

                    # Only report NEWLY started applications
                    if pid not in self.seen_pids:
                        if name in SUSPICIOUS_APPS:
                            act_type, desc, score = SUSPICIOUS_APPS[name]
                            self.send_event(
                                activity_type=act_type,
                                details=f"{desc} (PID {pid}: {name})",
                                anomaly_score=score,
                                is_deception=True
                            )
                        elif name in STANDARD_APPS:
                            act_type, desc, score = STANDARD_APPS[name]
                            self.send_event(
                                activity_type=act_type,
                                details=f"{desc} (PID {pid}: {name})",
                                anomaly_score=score,
                                is_deception=False
                            )
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    pass
            self.seen_pids = current_pids
        except Exception:
            pass

    def check_real_network_spikes(self):
        """Monitor actual outbound network throughput over your active network adapter."""
        try:
            now = time.time()
            dt = now - self.last_net_time
            if dt >= 15.0:  # Sample every 15s
                cur_bytes = psutil.net_io_counters().bytes_sent
                delta_mb = (cur_bytes - self.last_net_bytes) / (1024 * 1024)
                rate_mb_min = delta_mb * (60.0 / dt)

                # Only report if an abnormally high outbound transmission occurs (> 200 MB/min)
                if rate_mb_min > 200.0:
                    self.send_event(
                        activity_type="Network Traffic",
                        details=f"High outbound network usage ({round(rate_mb_min, 1)} MB/min transferred)",
                        anomaly_score=0.85,
                        is_deception=True
                    )
                self.last_net_bytes = cur_bytes
                self.last_net_time = now
        except Exception:
            pass

    def run(self):
        print("=" * 70)
        print("  LIVE WORKSTATION BEHAVIORAL MONITOR (REAL-TIME SENSOR)")
        print("=" * 70)
        print(f"  Assigned Participant : {self.employee_id}")
        print(f"  Target SOC Backend   : {self.api_url}")
        print(f"  Local Hostname       : {self.hostname}")
        print(f"  Hardware Partitions  : {', '.join(sorted(self.known_drives))}")
        print(f"  Sampling Frequency   : every {self.interval} seconds")
        print("-" * 70)
        print("  Active sensors: Process Monitor, Real USB Bus, Network IO")
        print("  Press Ctrl+C at any time to stop.")
        print("=" * 70)

        # Initial connect event
        self.send_event(
            activity_type="Login",
            details=f"Workstation sensor attached to host session ({self.hostname})",
            anomaly_score=0.05
        )

        while True:
            self.check_real_usb_events()
            self.check_real_process_events()
            self.check_real_network_spikes()
            time.sleep(self.interval)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real Live Workstation Behavioral Sensor")
    parser.add_argument("--emp", default=DEFAULT_EMPLOYEE, help="Employee ID to map telemetry to")
    parser.add_argument("--url", default=DEFAULT_API_URL, help="SOC Backend API endpoint URL")
    parser.add_argument("--interval", type=int, default=3, help="Polling interval in seconds")
    args = parser.parse_args()

    sensor = RealEndpointSensor(api_url=args.url, employee_id=args.emp, interval=args.interval)
    try:
        sensor.run()
    except KeyboardInterrupt:
        print("\n[*] Sensor stopped cleanly.")
