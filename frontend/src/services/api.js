// src/services/api.js
// Handles communication with Node.js backend.
// Graceful fallback to static data if backend is offline.

const API_BASE = 'http://127.0.0.1:5002/api';

// Fallback datasets matching database seeding outputs
const mockEmployees = [
  { employeeId:'EMP-8021', name:'Dr. Sarah Vance', email:'sarah.vance@cybercorp.org', department:'R&D', role:'Lead Research Scientist', status:'Under Monitoring', riskScore:88, riskLevel:'Critical', lastActivity: new Date().toISOString() },
  { employeeId:'EMP-4019', name:'Marcus Sterling', email:'marcus.s@cybercorp.org', department:'Finance', role:'Senior Financial Analyst', status:'Under Monitoring', riskScore:74, riskLevel:'High', lastActivity: new Date().toISOString() },
  { employeeId:'EMP-1102', name:'Elena Rostova', email:'elena.r@cybercorp.org', department:'IT Ops', role:'Database Systems Admin', status:'Active', riskScore:62, riskLevel:'Medium', lastActivity: new Date().toISOString() },
  { employeeId:'EMP-5531', name:'David Chen', email:'david.chen@cybercorp.org', department:'Software Engineering', role:'Backend Architect', status:'Active', riskScore:24, riskLevel:'Low', lastActivity: new Date().toISOString() },
  { employeeId:'EMP-9034', name:'Amanda Hayes', email:'amanda.h@cybercorp.org', department:'HR', role:'HR Business Partner', status:'Active', riskScore:18, riskLevel:'Low', lastActivity: new Date().toISOString() },
  { employeeId:'EMP-3120', name:'Robert Thorne', email:'robert.t@cybercorp.org', department:'Executive Office', role:'VP Strategy', status:'Active', riskScore:35, riskLevel:'Medium', lastActivity: new Date().toISOString() }
];

const mockActivities = [
  { activityId:'ACT-9001', employeeId:'EMP-8021', timestamp: new Date(Date.now()-1000*60*15).toISOString(),  activityType:'Network Traffic', details:'Encrypted outbound data spike (4.2 GB sent to external IP 185.220.101.4)', anomalyScore:0.94, isDeceptionTarget:true, location:'Remote VPN' },
  { activityId:'ACT-9002', employeeId:'EMP-8021', timestamp: new Date(Date.now()-1000*60*35).toISOString(),  activityType:'USB Connected', details:'High-speed mass storage drive (Kingston 128GB) attached to station RND-04', anomalyScore:0.89, isDeceptionTarget:true, location:'R&D Secure Lab' },
  { activityId:'ACT-9003', employeeId:'EMP-8021', timestamp: new Date(Date.now()-1000*60*50).toISOString(),  activityType:'File Access', details:'Accessed 180 files in 10 mins from /Research/Proprietary_AI_Weights_2026/', anomalyScore:0.85, isDeceptionTarget:true, location:'R&D Secure Lab' },
  { activityId:'ACT-8010', employeeId:'EMP-4019', timestamp: new Date(Date.now()-1000*60*45).toISOString(),  activityType:'Excel', details:'Exported bulk payroll spreadsheet with 4,500 employee PII records', anomalyScore:0.78, isDeceptionTarget:false, location:'Finance Office' },
  { activityId:'ACT-7001', employeeId:'EMP-1102', timestamp: new Date(Date.now()-1000*60*120).toISOString(), activityType:'Privilege Escalation', details:'Executed sudo su on database host DB-PROD-01 outside maintenance window', anomalyScore:0.65, isDeceptionTarget:false, location:'Server Room' }
];

const mockAlerts = [
  { alertId:'ALT-1001', employeeId:'EMP-8021', employeeName:'Dr. Sarah Vance', timestamp: new Date(Date.now()-1000*60*15).toISOString(), riskScore:88, severity:'Critical', category:'Data Exfiltration', reason:'Massive outbound encrypted traffic spike combined with high-volume file downloads & USB insertion.', status:'New' },
  { alertId:'ALT-1002', employeeId:'EMP-4019', employeeName:'Marcus Sterling', timestamp: new Date(Date.now()-1000*60*45).toISOString(), riskScore:74, severity:'High', category:'Unusual Bulk Export', reason:'Exported confidential payroll ledger onto unregistered USB device during abnormal hours.', status:'Investigating' },
  { alertId:'ALT-1003', employeeId:'EMP-1102', employeeName:'Elena Rostova', timestamp: new Date(Date.now()-1000*60*120).toISOString(), riskScore:62, severity:'Medium', category:'Privilege Misuse', reason:'Unscheduled root privilege escalation and raw database dump execution on production DB.', status:'Investigating' }
];

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Simulating login success.', err);
    return {
      success: true,
      token: 'mock-auth-token-2026',
      user: { id: 'ANALYST-01', name: 'Analyst Security Admin', email, role: 'SOC Senior Security Analyst' }
    };
  }
};

export const fetchDashboardData = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Using dashboard fallback data.', err);
    return {
      totalEmployees: 6,
      activeEmployees: 6,
      highRiskEmployees: 2,
      totalAlerts: 3,
      overallOrganizationRisk: { score: 50, level: 'Medium' },
      riskTrend: [
        { day:'Mon', avgRisk:22, anomalySpikes:2, criticalAlerts:0 },
        { day:'Tue', avgRisk:24, anomalySpikes:4, criticalAlerts:1 },
        { day:'Wed', avgRisk:31, anomalySpikes:8, criticalAlerts:1 },
        { day:'Thu', avgRisk:39, anomalySpikes:12, criticalAlerts:2 },
        { day:'Fri', avgRisk:48, anomalySpikes:19, criticalAlerts:3 },
        { day:'Sat', avgRisk:42, anomalySpikes:15, criticalAlerts:2 },
        { day:'Sun', avgRisk:50, anomalySpikes:23, criticalAlerts:4 }
      ],
      employeeRiskRanking: mockEmployees.sort((a,b)=>b.riskScore - a.riskScore).slice(0,5),
      recentAlerts: mockAlerts.slice(0,5),
      behaviorAnomalyChart: [
        { category:'Off-hours Logins', count:34, riskImpact:'High' },
        { category:'Bulk File Access', count:28, riskImpact:'High' },
        { category:'USB Exfiltration', count:19, riskImpact:'Critical' },
        { category:'Network Outbound Spike', count:42, riskImpact:'Critical' },
        { category:'Privilege Escalation', count:12, riskImpact:'Medium' }
      ]
    };
  }
};

export const fetchEmployees = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/employees?${query}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Loading employee directory from client memory.', err);
    let list = [...mockEmployees];
    if (params.department && params.department !== 'All') {
      list = list.filter(e => e.department === params.department);
    }
    if (params.riskLevel && params.riskLevel !== 'All') {
      list = list.filter(e => e.riskLevel === params.riskLevel);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q));
    }
    return list;
  }
};

export const fetchEmployeeDetails = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/employees/${id}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Loading employee details from client memory.', err);
    return mockEmployees.find(e => e.employeeId === id) || mockEmployees[0];
  }
};

export const registerEmployee = async (employeeData) => {
  try {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to register employee:', err);
    throw err;
  }
};

export const fetchEmployeeActivities = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/activities/${id}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Loading activities from client memory.', err);
    return mockActivities.filter(a => a.employeeId === id);
  }
};

export const fetchAlerts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/alerts?${query}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Loading alerts from client memory.', err);
    let list = [...mockAlerts];
    if (params.severity && params.severity !== 'All') {
      list = list.filter(a => a.severity === params.severity);
    }
    if (params.status && params.status !== 'All') {
      list = list.filter(a => a.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(a => a.employeeName.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q));
    }
    return list;
  }
};

export const fetchRiskAnalysis = async (employeeId) => {
  try {
    const res = await fetch(`${API_BASE}/risk/${employeeId}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Generating static JS risk analysis dashboard.', err);
    return {
      success: true,
      aiEngine: 'Client-Side Local Sandbox Fallback',
      data: {
        behavioralScore: 78,
        normalityScore: 22,
        behavioralDriftScore: 0.78,
        currentRisk: 78,
        predictedRisk: 87.3,
        riskLevel: 'Critical',
        mainContributingFactors: [
          { factor: 'Abnormal off-hours system usage (02:14 AM)', impact: 'High', weight: 35 },
          { factor: 'Unusual network payload upload volume (4.2 GB)', impact: 'Critical', weight: 40 },
          { factor: 'External storage drive attached in R&D Lab', impact: 'High', weight: 20 }
        ],
        isSimulated: true,
        simulationNotice: 'DEMO/SIMULATION RESULT — Client Web Fallback Simulator'
      }
    };
  }
};

export const runWhatIfSimulation = async (simPayload) => {
  try {
    const res = await fetch(`${API_BASE}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simPayload)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Running What-If analysis locally.', err);
    
    const {
      loginHour = 9,
      fileAccessCount = 20,
      usbUsage = 0,
      appActivity = 'Normal Office Apps',
      networkActivityMB = 150
    } = simPayload;

    const isOffHours = loginHour < 6 || loginHour > 21;
    const isHighFiles = fileAccessCount > 50;
    const isUsbActive = usbUsage > 0;
    const isHighNetwork = networkActivityMB > 300;

    const rawFactors = [];

    if (isOffHours) {
      const rawVal = loginHour < 4 || loginHour > 23 ? 35 : 15;
      rawFactors.push({
        factor: `Abnormal login time (${loginHour}:00 hrs)`,
        impact: rawVal > 20 ? 'High' : 'Medium',
        raw_weight: rawVal
      });
    }

    if (isHighFiles) {
      const rawVal = fileAccessCount > 200 ? 40 : fileAccessCount > 100 ? 25 : 10;
      rawFactors.push({
        factor: `High volume file access (${fileAccessCount} files)`,
        impact: rawVal > 25 ? 'High' : 'Medium',
        raw_weight: rawVal
      });
    }

    if (isUsbActive) {
      const rawVal = usbUsage === 2 ? 45 : 20;
      rawFactors.push({
        factor: usbUsage === 2 ? 'Mass USB exfiltration event' : 'External USB device attached',
        impact: rawVal > 30 ? 'High' : 'Medium',
        raw_weight: rawVal
      });
    }

    if (isHighNetwork) {
      const rawVal = networkActivityMB > 2000 ? 40 : networkActivityMB > 800 ? 25 : 10;
      rawFactors.push({
        factor: `Unusual outbound data volume (${networkActivityMB} MB)`,
        impact: rawVal > 20 ? 'High' : 'Low',
        raw_weight: rawVal
      });
    }

    const app = String(appActivity).toLowerCase();
    const hasOtherAnomaly = isOffHours || isHighFiles || isUsbActive || isHighNetwork;

    if (app.includes('tor') || app.includes('vpn') || app.includes('proxy') || app.includes('onion')) {
      const rawVal = hasOtherAnomaly ? 30 : 5;
      rawFactors.push({
        factor: 'Unusual Application/Network Behavior',
        impact: hasOtherAnomaly ? 'High' : 'Low',
        raw_weight: rawVal
      });
    } else if (app.includes('privilege') || app.includes('escalation') || app.includes('terminal') || app.includes('powershell') || app.includes('cli')) {
      const rawVal = app.includes('privilege') ? 30 : 20;
      rawFactors.push({
        factor: `Administrative Shell Console Executed (${appActivity})`,
        impact: rawVal > 20 ? 'High' : 'Medium',
        raw_weight: rawVal
      });
    }

    const base_risk = 10.0;
    const sum_raw_weights = rawFactors.reduce((acc, f) => acc + f.raw_weight, 0);
    let currentRisk = base_risk + sum_raw_weights;

    if (currentRisk > 100.0) {
      const scale = (100.0 - base_risk) / sum_raw_weights;
      currentRisk = 100.0;
      rawFactors.forEach(f => {
        f.weight = parseFloat((f.raw_weight * scale).toFixed(1));
      });
    } else {
      currentRisk = parseFloat(currentRisk.toFixed(1));
      rawFactors.forEach(f => {
        f.weight = parseFloat(f.raw_weight.toFixed(1));
      });
    }

    if (rawFactors.length === 0) {
      rawFactors.push({
        factor: 'Standard baseline activity — no anomalies detected',
        impact: 'Low',
        weight: 5.0
      });
      currentRisk = 15.0;
    }

    const normalityScore = parseFloat((100.0 - currentRisk).toFixed(1));
    const behavioralDrift = parseFloat((currentRisk / 100.0).toFixed(2));
    const predictedRisk = Math.min(100.0, parseFloat((currentRisk * 1.12).toFixed(1)));
    const riskDelta = parseFloat((predictedRisk - currentRisk).toFixed(1));

    return {
      success: true,
      aiEngine: 'Local Browser Sandbox Emulator',
      data: {
        currentRisk,
        predictedRisk,
        riskChange: riskDelta,
        riskChangeDirection: riskDelta > 0 ? 'Increase' : riskDelta < 0 ? 'Decrease' : 'Unchanged',
        riskLevel: currentRisk >= 75 ? 'Critical' : currentRisk >= 50 ? 'High' : currentRisk >= 30 ? 'Medium' : 'Low',
        normalityScore,
        behavioralDrift,
        explanation: rawFactors.map(f => f.factor).join('; '),
        contributingFactors: rawFactors
      }
    };
  }
};

export const runResearchSimulation = async (scenario, config = {}) => {
  try {
    const res = await fetch(`${API_BASE}/research/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, config })
    });
    return await res.json();
  } catch (err) {
    console.warn('[API Fallback] Backend offline. Running local browser research emulator.', err);
    
    const timeline = [];
    const days = Array.from({ length: 10 }, (_, i) => i + 1);
    let adaptiveMean = 30;
    let adaptiveStd = 10;
    let driftMean = 30;
    let driftStd = 10;
    let driftLocked = false;
    
    for (const day of days) {
      const item = {
        day,
        fileAccessCount: 30,
        networkActivityMB: 150,
        appActivity: 'Normal Office Apps'
      };
      
      if (scenario === 'sudden_attack') {
        if (day >= 8) {
          item.fileAccessCount = 180;
          item.networkActivityMB = 1200;
          item.appActivity = 'Tor Browser VPN Tunnel';
        }
      } else if (scenario === 'gradual_drift') {
        const driftFiles = [30, 35, 42, 55, 70, 100, 150, 180, 210, 240];
        const driftNet = [150, 180, 220, 290, 380, 500, 700, 950, 1200, 1500];
        item.fileAccessCount = driftFiles[day - 1];
        item.networkActivityMB = driftNet[day - 1];
        if (day >= 5) item.appActivity = 'Command Prompt Admin Shell';
        if (day >= 7) item.appActivity = 'PowerShell Console Exec';
        if (day >= 9) item.appActivity = 'Tor Browser VPN Tunnel';
      } else {
        const variations = [0, -2, 1, -1, 2, 0, -1, 1, 0, -2];
        item.fileAccessCount = 30 + variations[day - 1];
        item.networkActivityMB = 150 + variations[day - 1] * 5;
      }
      
      // 1. Static Detector
      const zStatic = Math.abs(item.fileAccessCount - 30) / 10;
      const static_normality = Math.max(5, Math.min(99, 100 - (zStatic * 15 + (item.fileAccessCount > 100 ? 25 : 0))));
      const static_drift = Math.max(0.0, Math.min(1.0, zStatic / 8));
      const sRiskVal = item.appActivity.includes('Tor') ? 35 : 10;
      const static_risk = Math.max(10, Math.min(100, Math.round((100 - static_normality) * 0.6 + static_drift * 40 + sRiskVal)));

      // 2. Adaptive Detector
      const zAdaptive = Math.abs(item.fileAccessCount - adaptiveMean) / adaptiveStd;
      const adaptive_normality = Math.max(5, Math.min(99, 100 - (zAdaptive * 15 + (item.fileAccessCount > 100 ? 25 : 0))));
      const adaptive_drift = Math.max(0.0, Math.min(1.0, zAdaptive / 8));
      const aRiskVal = item.appActivity.includes('Tor') ? 35 : 10;
      const adaptive_risk = Math.max(10, Math.min(100, Math.round((100 - adaptive_normality) * 0.6 + adaptive_drift * 40 + aRiskVal)));
      
      // Retrain Adaptive
      adaptiveMean = parseFloat((adaptiveMean * 0.8 + item.fileAccessCount * 0.2).toFixed(1));
      adaptiveStd = parseFloat((adaptiveStd * 0.9 + Math.max(2, Math.abs(item.fileAccessCount - adaptiveMean)) * 0.1).toFixed(1));
      
      // 3. Behavioral Drift Detector
      const zOrig = Math.abs(item.fileAccessCount - 30) / 10;
      if (zOrig > 4.5) {
        driftLocked = true;
      }
      const zDrift = Math.abs(item.fileAccessCount - driftMean) / driftStd;
      const drift_normality = Math.max(5, Math.min(99, 100 - (zDrift * 15 + (item.fileAccessCount > 100 ? 25 : 0))));
      const d_drift = Math.max(0.0, Math.min(1.0, zDrift / 8));
      const dRiskVal = item.appActivity.includes('Tor') ? 35 : 10;
      let drift_aware_risk = Math.max(10, Math.min(100, Math.round((100 - drift_normality) * 0.6 + d_drift * 40 + dRiskVal)));
      if (driftLocked) {
        drift_aware_risk = Math.max(drift_aware_risk, 75.0);
      }
      
      timeline.push({
        day,
        fileAccessCount: item.fileAccessCount,
        networkActivityMB: item.networkActivityMB,
        appActivity: item.appActivity,
        static_risk,
        static_status: static_risk >= 50 ? 'Alarm Triggered' : 'Normal',
        adaptive_risk,
        adaptive_status: adaptive_risk >= 50 ? 'Alarm Triggered' : 'Normal',
        drift_aware_risk,
        drift_aware_status: drift_aware_risk >= 50 ? 'Alarm Triggered' : 'Normal',
        drift_aware_drift: parseFloat(zOrig.toFixed(2)),
        adaptation_locked: driftLocked
      });
    }
    
    return {
      success: true,
      aiEngine: 'Local Browser Research Emulator',
      scenario,
      timeline,
      isSimulated: true
    };
  }
};

export const runExperimentSuite = async (config) => {
  try {
    const res = await fetch(`${API_BASE}/research/experiment-suite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data;
  } catch (err) {
    console.error('Experiment suite failed:', err);
    throw err;
  }
};
