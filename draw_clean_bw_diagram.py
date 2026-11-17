import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Set high-resolution figure (13 x 7.6 inches, 300 DPI)
fig, ax = plt.subplots(figsize=(13, 7.6), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Pure White Background
fig.patch.set_facecolor('white')
ax.set_facecolor('white')

# Title & Subtitle at Top
ax.text(50, 96.5, "Figure 1: Architectural Workflow of the Counterfactual Digital Twin Insider Threat Detection Framework", 
        fontsize=12.0, fontweight='bold', ha='center', va='center', fontfamily='sans-serif', color='black')
ax.text(50, 93.2, "Illustrating OS telemetry ingestion, microservices API gateway, Isolation Forest drift-lock engine, and counterfactual console.", 
        fontsize=9, fontstyle='italic', ha='center', va='center', fontfamily='sans-serif', color='#444444')

# Card Drawing Function
def draw_card(x, y, w, h, title, tag, bullets):
    # Outer Card Rectangle
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.6,rounding_size=2.2", 
                                  facecolor="white", edgecolor="black", linewidth=1.5)
    ax.add_patch(rect)
    
    # Title
    ax.text(x + 2.2, y + h - 4.5, title, fontsize=10, fontweight='bold', fontfamily='sans-serif', color='black')
    
    # Tag Badge (Right aligned within card)
    tag_w = 9.5
    tag_h = 3.4
    tag_box = patches.FancyBboxPatch((x + w - tag_w - 2, y + h - 6.2), tag_w, tag_h, 
                                     boxstyle="round,pad=0.2,rounding_size=1",
                                     facecolor="#f2f2f2", edgecolor="black", linewidth=0.9)
    ax.add_patch(tag_box)
    ax.text(x + w - (tag_w / 2) - 2, y + h - 4.5, tag, fontsize=7.5, fontweight='bold', ha='center', va='center', fontfamily='monospace', color='black')
    
    # Divider line
    ax.plot([x + 1.8, x + w - 1.8], [y + h - 8, y + h - 8], color='#bbbbbb', linewidth=0.7)
    
    # Bullets
    cur_y = y + h - 12.8
    for b in bullets:
        ax.text(x + 2.5, cur_y, "•", fontsize=10, fontweight='bold', color='black')
        ax.text(x + 4.8, cur_y - 0.2, b, fontsize=8.0, fontfamily='sans-serif', color='#111111')
        cur_y -= 4.6

# 2. Gateway (Top Left)
b2_bullets = [
    "Port 5000: Microservices Orchestrator & JWT Auth",
    "Persistent Store: registered_employees.json",
    "Activity Controller: Ingests Real Endpoint Stream",
    "Sanitizer Service: Infinity / NaN Float Sanitization",
    "Dynamic Risk Index: 0–100 Weighted Score Engine"
]
draw_card(3, 51, 42, 38, "2. Node.js / Express API Gateway", ":5000", b2_bullets)

# 4. Console (Top Right)
b4_bullets = [
    "Port 3000: Executive Bright SIEM Interface",
    "Real-Time SOC Dashboard & 7-Day Trend Visualizer",
    "Workstation Telemetry Audit (4s Polling Refresh)",
    "What-If Sandbox: Interactive Attack Vector Testing",
    "Empirical 30-Trial Evaluation Lab & CSV/JSON Export"
]
draw_card(55, 51, 42, 38, "4. React 18 / Vite Security Console", ":3000", b4_bullets)

# 1. Sensor (Bottom Left)
b1_bullets = [
    "Real Host OS Sensor daemon (agent/monitor.py)",
    "Process Enumeration (psutil snapshot delta)",
    "Win32 Kernel: GetDriveTypeW == 2 (Physical USB)",
    "Delta Tx Bytes: Real NIC Outbound Exfiltration",
    "Monitored Sandbox: Real Local File Activity"
]
draw_card(3, 7, 42, 38, "1. Endpoint Hardware Telemetry Sensor", "KERNEL", b1_bullets)

# 3. AI Service (Bottom Right)
b3_bullets = [
    "Port 5001 (Flask): Isolation Forest Model (T=100)",
    "6-Vector Behavioral Baseline (n=600 Normals)",
    "Drift Metric: D_t = ∑ |Z_j| Across 6 Behavioral Features",
    "Persistence Lock: Halt Baseline Updates if D_t ≥ 4.5",
    "Paired t-Test Engine: Multi-Trial Research Suite"
]
draw_card(55, 7, 42, 38, "3. Python AI Behavioral Microservice", ":5001", b3_bullets)

# Horizontal Arrow 2 -> 4 (Top)
ax.annotate('', xy=(55, 74), xytext=(45, 74),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, color='black', mutation_scale=11))
ax.text(50, 75.8, "Telemetry & Audit Logs", fontsize=7.2, fontweight='bold', ha='center')

# Horizontal Arrow 4 -> 2 (Top)
ax.annotate('', xy=(45, 66), xytext=(55, 66),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, color='black', mutation_scale=11))
ax.text(50, 64.2, "User Controls & Sim Calls", fontsize=7.2, fontweight='bold', ha='center')

# Horizontal Arrow 1 -> 3 (Bottom)
ax.annotate('', xy=(55, 18), xytext=(45, 18),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, color='black', mutation_scale=11))
ax.text(50, 19.8, "6D Feature Vector x_t", fontsize=7.2, fontweight='bold', ha='center')

# Vertical Arrow 1 -> 2 (Left)
ax.annotate('', xy=(20, 51), xytext=(20, 45),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, color='black', mutation_scale=11))
ax.text(21.5, 48, "HTTP POST /api/activities\n(Real Telemetry Events)", fontsize=6.8, fontweight='bold', va='center')

# Diagonal Arrow 2 -> 3 (Gateway down to AI)
ax.annotate('', xy=(55, 40), xytext=(45, 54),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, color='black', mutation_scale=11))
ax.text(49, 48.5, "Forward Features\n/research/simulate", fontsize=6.8, fontweight='bold', ha='center',
        bbox=dict(boxstyle="square,pad=0.2", facecolor="white", edgecolor="none"))

# Diagonal Arrow 3 -> 2 (AI up to Gateway - Dashed)
ax.annotate('', xy=(45, 59), xytext=(55, 33),
            arrowprops=dict(arrowstyle="-|>", lw=1.3, linestyle="--", color='black', mutation_scale=11))
ax.text(51, 38.5, "Lock State & Scores\n(D_t ≥ 4.5 Trigger)", fontsize=6.8, fontweight='bold', ha='center',
        bbox=dict(boxstyle="square,pad=0.2", facecolor="white", edgecolor="none"))

plt.tight_layout()

# Save at 300 DPI
fig.savefig('fig1.png', dpi=300, facecolor='white', bbox_inches='tight')
fig.savefig('paper_assets/figure1_architecture_bw.png', dpi=300, facecolor='white', bbox_inches='tight')
fig.savefig(r'C:\Users\harit\.gemini\antigravity-ide\brain\ec89e6b4-03ec-4f26-b922-8738ded3ff49\fig1.png', dpi=300, facecolor='white', bbox_inches='tight')

print("Refined B&W Diagram saved successfully at 300 DPI!")
