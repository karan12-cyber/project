import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

// ── helpers ──
function getAllUsers() {
  const users = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("gymProfile_")) {
      try {
        const profile = JSON.parse(localStorage.getItem(key));
        if (profile) users.push(profile);
      } catch {}
    }
  }
  return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function updateMembership(email, status) {
  const key = `gymProfile_${email}`;
  try {
    const profile = JSON.parse(localStorage.getItem(key));
    if (profile) {
      profile.membership = status;
      localStorage.setItem(key, JSON.stringify(profile));
    }
  } catch {}
}

const COLORS = ["#f97316","#38bdf8","#22c55e","#a855f7","#f59e0b","#ef4444","#06b6d4","#84cc16"];
function avatarColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

// ── canvas bar chart (no library needed) ──
function RevenueChart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const data2026 = [310,345,390,420,null,null,null,null,null,null,null,null];
    const data2025 = [265,290,320,360,340,370,355,390,410,380,420,460];
    const labels   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const maxVal = 500;
    const padL=52, padR=16, padT=16, padB=28;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const groupW = chartW / 12;
    const barW   = groupW * 0.28;

    ctx.clearRect(0, 0, W, H);

    // grid lines + y labels
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = "#7a7f8a";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("₹" + (maxVal - (maxVal / 4) * i) + "K", padL - 6, y + 4);
    }

    // bars
    labels.forEach((lbl, i) => {
      const x = padL + groupW * i + groupW / 2;

      const v25 = data2025[i];
      const h25 = (v25 / maxVal) * chartH;
      ctx.fillStyle = "#2d3142";
      ctx.beginPath();
      ctx.roundRect(x - barW - 2, padT + chartH - h25, barW, h25, 3);
      ctx.fill();

      const v26 = data2026[i];
      if (v26 !== null) {
        const h26 = (v26 / maxVal) * chartH;
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.roundRect(x + 2, padT + chartH - h26, barW, h26, 3);
        ctx.fill();
      }

      ctx.fillStyle = "#7a7f8a";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(lbl, x, H - 6);
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ── static data ──
const CLASSES = [
  { time:"6:00",  ampm:"AM", name:"CrossFit Fundamentals", meta:"Coach Rajan • Hall A",   spots:"18/20", pct:90,  color:"#f97316" },
  { time:"8:30",  ampm:"AM", name:"Yoga Flow",             meta:"Coach Priya • Studio B", spots:"12/15", pct:80,  color:"#38bdf8" },
  { time:"11:00", ampm:"AM", name:"Zumba",                 meta:"Coach Anjali • Hall B",  spots:"8/20",  pct:40,  color:"#22c55e" },
  { time:"5:30",  ampm:"PM", name:"HIIT Blast",            meta:"Coach Vikram • Hall A",  spots:"20/20", pct:100, color:"#a855f7" },
];

const TRAINERS = [
  { initials:"RK", name:"Coach Rajan Kumar", spec:"CrossFit · Strength", rating:"4.9", stars:"★★★★★", sessions:142, color:"#f97316" },
  { initials:"PS", name:"Coach Priya Singh",  spec:"Yoga · Pilates",     rating:"4.8", stars:"★★★★★", sessions:118, color:"#a855f7" },
  { initials:"VN", name:"Coach Vikram Nair",  spec:"HIIT · Cardio",      rating:"4.7", stars:"★★★★☆", sessions:97,  color:"#38bdf8" },
  { initials:"AM", name:"Coach Anjali M.",    spec:"Zumba · Dance",      rating:"4.6", stars:"★★★★☆", sessions:84,  color:"#22c55e" },
];

const REVENUE_ITEMS = [
  { label:"Memberships",       amount:"₹2,18,400", pct:52, color:"#f97316" },
  { label:"Personal Training", amount:"₹1,05,200", pct:25, color:"#a855f7" },
  { label:"Group Classes",     amount:"₹63,000",   pct:15, color:"#38bdf8" },
  { label:"Supplements Shop",  amount:"₹33,600",   pct:8,  color:"#22c55e" },
];

const ALERTS = [
  { text:"5:30 PM HIIT Blast is fully booked — 4 members on waitlist",         time:"2 minutes ago",      color:"#ef4444" },
  { text:"Treadmill #7 in Zone B reported as malfunctioning by Coach Rajan",    time:"38 minutes ago",     color:"#f97316" },
  { text:"New Elite membership signed — Ananya Patel (12-month) ₹36,000",      time:"1 hour ago",         color:"#22c55e" },
  { text:"Monthly report for March 2026 is ready — download from Reports",      time:"3 hours ago",        color:"#38bdf8" },
  { text:"Coach Anjali Mehra has updated her availability for next week",        time:"Yesterday, 6:14 PM", color:"#a855f7" },
];

const NAV = [
  { id:"dashboard", label:"Dashboard", section:"Overview",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:"members", label:"Members", section:null,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id:"analytics", label:"Analytics", section:null,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id:"classes", label:"Classes", section:"Operations",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:"trainers", label:"Trainers", section:null,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
  { id:"revenue", label:"Revenue", section:null,
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id:"settings", label:"Settings", section:"System",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 1 0 4.93 19.07"/><path d="M19.07 4.93l-7.07 7.07"/></svg> },
];

// ══════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers]         = useState([]);
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const refreshUsers = () => setUsers(getAllUsers());

  const handleToggle = (email, current) => {
    const next = current === "Active" ? "Inactive" : "Active";
    updateMembership(email, next);
    refreshUsers();
    setToast(`${email} → ${next}`);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = users.filter(u => u.membership === "Active").length;
  const inactiveCount = users.filter(u => u.membership === "Inactive").length;

  return (
    <div className="ad-wrap">

      {/* TOAST */}
      {toast && <div className="ad-toast">✅ Updated: {toast}</div>}

      {/* ── SIDEBAR ── */}
      <aside className="ad-sidebar">
        <div className="ad-logo">
          <div className="ad-logo-mark">RAGNAROK<span>.FITNESS</span></div>
          <div className="ad-logo-sub">Admin Portal</div>
        </div>

        <nav className="ad-nav">
          {NAV.map(item => (
            <div key={item.id}>
              {item.section && <div className="ad-nav-section">{item.section}</div>}
              <button
                className={`ad-nav-item ${activeTab === item.id ? "ad-active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="ad-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <div className="ad-admin-chip">
            <div className="ad-admin-av">AK</div>
            <div>
              <div className="ad-admin-name">Arjun Kapoor</div>
              <div className="ad-admin-role">Super Admin</div>
            </div>
          </div>
          <button className="ad-logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="ad-main">

        {/* TOPBAR */}
        <header className="ad-topbar">
          <div className="ad-page-title">
            {NAV.find(n => n.id === activeTab)?.label}
            <span className="ad-page-sub"> — April 2026</span>
          </div>
          <div className="ad-topbar-right">
            <input
              className="ad-search"
              type="text"
              placeholder="Search members…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="ad-content">

          {/* ══ DASHBOARD ══ */}
          {activeTab === "dashboard" && (
            <>
              {/* stats */}
              <div className="ad-stats-grid">
                <div className="ad-stat-card" style={{"--ca":"#f97316"}}>
                  <div className="ad-stat-icon" style={{background:"rgba(249,115,22,0.15)"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="ad-stat-label">Total Members</div>
                  <div className="ad-stat-value">{users.length || 0}</div>
                  <div className="ad-stat-sub"><span className="ad-badge-stat">{activeCount} active</span></div>
                </div>
                <div className="ad-stat-card" style={{"--ca":"#22c55e"}}>
                  <div className="ad-stat-icon" style={{background:"rgba(34,197,94,0.15)"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div className="ad-stat-label">Monthly Revenue</div>
                  <div className="ad-stat-value">₹4.2L</div>
                  <div className="ad-stat-sub"><span className="ad-badge-stat">+8.1%</span> vs last month</div>
                </div>
                <div className="ad-stat-card" style={{"--ca":"#38bdf8"}}>
                  <div className="ad-stat-icon" style={{background:"rgba(56,189,248,0.15)"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div className="ad-stat-label">Active Classes</div>
                  <div className="ad-stat-value">38</div>
                  <div className="ad-stat-sub"><span className="ad-badge-stat">+3</span> new this week</div>
                </div>
                <div className="ad-stat-card" style={{"--ca":"#a855f7"}}>
                  <div className="ad-stat-icon" style={{background:"rgba(168,85,247,0.15)"}}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </div>
                  <div className="ad-stat-label">Trainers</div>
                  <div className="ad-stat-value">24</div>
                  <div className="ad-stat-sub"><span className="ad-badge-stat down">-1</span> on leave</div>
                </div>
              </div>

              {/* chart + classes */}
              <div className="ad-grid-2">
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <div className="ad-panel-title">Revenue Overview</div>
                    <div style={{display:"flex",gap:10,fontSize:11,color:"#7a7f8a"}}>
                      <span style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{width:10,height:10,borderRadius:2,background:"#f97316",display:"inline-block"}}/>2026
                      </span>
                      <span style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{width:10,height:10,borderRadius:2,background:"#3b4050",display:"inline-block"}}/>2025
                      </span>
                    </div>
                  </div>
                  <div className="ad-panel-body">
                    <div className="ad-chart-wrap"><RevenueChart /></div>
                  </div>
                </div>

                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <div className="ad-panel-title">Today's Classes</div>
                  </div>
                  <div className="ad-panel-body">
                    <div className="ad-class-list">
                      {CLASSES.map(c => (
                        <div className="ad-class-item" key={c.name} style={{borderLeftColor:c.color}}>
                          <div className="ad-class-time">{c.time}<div className="ad-class-ampm">{c.ampm}</div></div>
                          <div style={{flex:1}}>
                            <div className="ad-class-name">{c.name}</div>
                            <div className="ad-class-meta">{c.meta}</div>
                          </div>
                          <div className="ad-class-right">
                            <div className="ad-class-spots">{c.spots}</div>
                            <div className="ad-cap-bar">
                              <div className="ad-cap-fill" style={{width:c.pct+"%",background:c.color}}/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* alerts */}
              <div className="ad-panel">
                <div className="ad-panel-head">
                  <div className="ad-panel-title">Recent Alerts &amp; Activity</div>
                </div>
                <div className="ad-panel-body">
                  <div className="ad-alerts">
                    {ALERTS.map((a,i) => (
                      <div className="ad-alert-item" key={i} style={{borderLeftColor:a.color}}>
                        <div className="ad-alert-dot" style={{background:a.color}}/>
                        <div>
                          <div className="ad-alert-text">{a.text}</div>
                          <div className="ad-alert-time">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══ MEMBERS ══ */}
          {activeTab === "members" && (
            <>
              <div className="ad-members-summary">
                <div className="ad-mem-chip">
                  <span className="ad-mem-chip-val">{users.length}</span>
                  <span className="ad-mem-chip-lbl">Total</span>
                </div>
                <div className="ad-mem-chip green">
                  <span className="ad-mem-chip-val">{activeCount}</span>
                  <span className="ad-mem-chip-lbl">Active</span>
                </div>
                <div className="ad-mem-chip red">
                  <span className="ad-mem-chip-val">{inactiveCount}</span>
                  <span className="ad-mem-chip-lbl">Inactive</span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="ad-empty">
                  {users.length === 0
                    ? "No users signed up yet. They will appear here after registering."
                    : "No users match your search."}
                </div>
              ) : (
                <div className="ad-panel">
                  <div className="ad-panel-head">
                    <div className="ad-panel-title">All Members ({filtered.length})</div>
                    <span className="ad-panel-action" onClick={refreshUsers}>↻ Refresh</span>
                  </div>
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Age</th>
                        <th>Weight</th>
                        <th>Goal</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(u => (
                        <tr key={u.email}>
                          <td>
                            <div className="ad-member-info">
                              <div className="ad-member-av" style={{background:avatarColor(u.name||u.email)}}>
                                {(u.name||u.email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="ad-member-name">{u.name}</div>
                                <div className="ad-member-email">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{color:"#aaa"}}>{u.age ? u.age+" yrs" : "—"}</td>
                          <td style={{color:"#aaa"}}>{u.weightKg ? u.weightKg+" kg" : "—"}</td>
                          <td style={{color:"#aaa"}}>
                            {u.goal==="lose" ? "Lose Weight" : u.goal==="gain" ? "Gain Muscle" : "Stay Fit"}
                          </td>
                          <td style={{color:"#7a7f8a"}}>
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
                              : "—"}
                          </td>
                          <td>
                            <span className={`ad-badge ${u.membership==="Active" ? "ad-badge-active" : "ad-badge-inactive"}`}>
                              {u.membership}
                            </span>
                          </td>
                          <td>
                            <button
                              className={`ad-toggle-btn ${u.membership==="Active" ? "deactivate" : "activate"}`}
                              onClick={() => handleToggle(u.email, u.membership)}
                            >
                              {u.membership==="Active" ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ══ ANALYTICS ══ */}
          {activeTab === "analytics" && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <div className="ad-panel-title">Revenue Overview</div>
                <div style={{display:"flex",gap:10,fontSize:11,color:"#7a7f8a"}}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:10,height:10,borderRadius:2,background:"#f97316",display:"inline-block"}}/>2026
                  </span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{width:10,height:10,borderRadius:2,background:"#3b4050",display:"inline-block"}}/>2025
                  </span>
                </div>
              </div>
              <div className="ad-panel-body">
                <div className="ad-chart-wrap" style={{height:320}}><RevenueChart /></div>
              </div>
            </div>
          )}

          {/* ══ CLASSES ══ */}
          {activeTab === "classes" && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <div className="ad-panel-title">Today's Schedule</div>
              </div>
              <div className="ad-panel-body">
                <div className="ad-class-list">
                  {CLASSES.map(c => (
                    <div className="ad-class-item" key={c.name} style={{borderLeftColor:c.color,padding:"16px 18px"}}>
                      <div className="ad-class-time" style={{fontSize:22}}>{c.time}<div className="ad-class-ampm">{c.ampm}</div></div>
                      <div style={{flex:1}}>
                        <div className="ad-class-name" style={{fontSize:15}}>{c.name}</div>
                        <div className="ad-class-meta">{c.meta}</div>
                      </div>
                      <div className="ad-class-right">
                        <div className="ad-class-spots" style={{fontSize:13}}>{c.spots} spots</div>
                        <div className="ad-cap-bar" style={{width:100}}>
                          <div className="ad-cap-fill" style={{width:c.pct+"%",background:c.color}}/>
                        </div>
                        <div style={{fontSize:11,color:"#7a7f8a",marginTop:3}}>{c.pct}% full</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ TRAINERS ══ */}
          {activeTab === "trainers" && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <div className="ad-panel-title">Trainer Roster</div>
              </div>
              <div className="ad-panel-body">
                {TRAINERS.map(t => (
                  <div className="ad-trainer-row" key={t.name}>
                    <div className="ad-trainer-av" style={{background:t.color}}>{t.initials}</div>
                    <div style={{flex:1}}>
                      <div className="ad-trainer-name">{t.name}</div>
                      <div className="ad-trainer-spec">{t.spec}</div>
                    </div>
                    <div className="ad-trainer-right">
                      <div className="ad-trainer-rating">{t.rating} <span className="ad-stars">{t.stars}</span></div>
                      <div className="ad-trainer-sessions">{t.sessions} sessions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeTab === "settings" && (
            <div className="ad-panel">
              <div className="ad-panel-head">
                <div className="ad-panel-title">Admin Settings</div>
              </div>
              <div className="ad-panel-body">
                <div className="ad-settings-grid">
                  <div className="ad-setting-row">
                    <div>
                      <div className="ad-setting-label">Admin ID</div>
                      <div className="ad-setting-sub">Your login identifier</div>
                    </div>
                    <span className="ad-setting-val">ragnarok_admin</span>
                  </div>
                  <div className="ad-setting-row">
                    <div>
                      <div className="ad-setting-label">Password</div>
                      <div className="ad-setting-sub">Last changed: never</div>
                    </div>
                    <span className="ad-setting-val">••••••••</span>
                  </div>
                  <div className="ad-setting-row">
                    <div>
                      <div className="ad-setting-label">Gym Name</div>
                      <div className="ad-setting-sub">Displayed across the app</div>
                    </div>
                    <span className="ad-setting-val">Ragnarok Fitness</span>
                  </div>
                  <div className="ad-setting-row">
                    <div>
                      <div className="ad-setting-label">Default Membership</div>
                      <div className="ad-setting-sub">Assigned on new signup</div>
                    </div>
                    <span className="ad-setting-val">Active</span>
                  </div>
                  <div className="ad-setting-row">
                    <div>
                      <div className="ad-setting-label">Total Registered Users</div>
                      <div className="ad-setting-sub">From localStorage</div>
                    </div>
                    <span className="ad-setting-val">{users.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}