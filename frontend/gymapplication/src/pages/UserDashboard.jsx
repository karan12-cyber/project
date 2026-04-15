import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./UserDashboard.css";

// --- helpers ---
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// get active user email, fall back to legacy gymUser for old sessions
function getActiveEmail() {
  return localStorage.getItem("gymActiveEmail") || "__legacy__";
}
function getProfile() {
  const email = getActiveEmail();
  if (email === "__legacy__") {
    return load("gymUser", { name: "User", membership: "Active", photoUrl: "", age: null });
  }
  return load(`gymProfile_${email}`, { name: "User", membership: "Active", photoUrl: "", age: null });
}
function userKey(base) {
  const email = getActiveEmail();
  if (email === "__legacy__") return base; // old keys
  return `${base}_${email}`;
}

const WORKOUTS = {
  Monday:    { label: "Chest Day 💪",   exercises: ["Bench Press – 4×10", "Incline DB Press – 3×12", "Cable Flyes – 3×15", "Push-ups – 2×failure"] },
  Tuesday:   { label: "Back Day 🏋️",    exercises: ["Deadlift – 4×6", "Pull-ups – 3×8", "Seated Row – 3×12", "Lat Pulldown – 3×12"] },
  Wednesday: { label: "Legs Day 🦵",    exercises: ["Squats – 4×10", "Leg Press – 3×12", "Lunges – 3×10 each", "Calf Raises – 4×20"] },
  Thursday:  { label: "Shoulders 🔥",   exercises: ["OHP – 4×8", "Lateral Raises – 3×15", "Front Raises – 3×12", "Face Pulls – 3×15"] },
  Friday:    { label: "Arms Day 💥",    exercises: ["Barbell Curl – 4×10", "Skull Crushers – 3×12", "Hammer Curls – 3×12", "Tricep Dips – 3×failure"] },
  Saturday:  { label: "Cardio + Core",  exercises: ["Plank – 3×60s", "Crunches – 3×20", "Mountain Climbers – 3×30", "20 min jog"] },
  Sunday:    { label: "Rest Day 😴",    exercises: ["Stretch 10 min", "Light walk if you want", "Hydrate well", "Sleep early bro"] },
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayDay = DAYS[new Date().getDay()];
const todayWorkout = WORKOUTS[todayDay];

const MEAL_PLANS = [
  { time: "Morning", meal: "Oats + banana + 2 boiled eggs", cal: 380, p: 22, c: 55, f: 8 },
  { time: "Lunch",   meal: "Dal chawal + sabzi + curd",     cal: 520, p: 18, c: 80, f: 10 },
  { time: "Snack",   meal: "Peanut butter bread + milk",    cal: 310, p: 14, c: 38, f: 12 },
  { time: "Dinner",  meal: "Roti + paneer/chicken + salad", cal: 490, p: 30, c: 50, f: 14 },
];

const BADGES = [
  { id: "first",   icon: "🥇", label: "First Workout",   desc: "Complete your first workout" },
  { id: "week",    icon: "🔥", label: "7 Day Streak",     desc: "Workout 7 days in a row" },
  { id: "ten",     icon: "💪", label: "10 Workouts",      desc: "Log 10 total workouts" },
  { id: "hydro",   icon: "💧", label: "Hydration Hero",   desc: "Hit water goal 3 days" },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");

  // user data
  const [user]         = useState(() => getProfile());
  const [weightKg, setWeightKg]   = useState(() => load(userKey("gymWeight"), () => getProfile().weightKg || 75));
  const [heightCm, setHeightCm]   = useState(() => load(userKey("gymHeight"), () => getProfile().heightCm || 170));
  const [targetKg, setTargetKg]   = useState(() => load(userKey("gymTarget"), () => getProfile().weightKg || 70));
  const [history, setHistory]     = useState(() => load(userKey("gymHistory"), []));
  const [water, setWater]         = useState(() => {
    const d = load(userKey("gymWaterDate"), "");
    if (d !== todayStr()) return 0;
    return load(userKey("gymWater"), 0);
  });
  const [calories, setCalories]   = useState(() => load(userKey("gymCalTotal"), 0));
  const [todayDone, setTodayDone] = useState(() => load(userKey("gymTodayDone"), "") === todayStr());
  const [streak, setStreak]       = useState(() => load(userKey("gymStreak"), 0));

  // ui state
  const [weightInput, setWeightInput]   = useState(String(weightKg));
  const [heightInput, setHeightInput]   = useState(String(heightCm));
  const [targetInput, setTargetInput]   = useState(String(targetKg));
  const [showWeightSave, setShowWeightSave] = useState(false);
  const [showHeightSave, setShowHeightSave] = useState(false);
  const [congrats, setCongrats]         = useState(false);
  const [logName, setLogName]           = useState("");
  const [showLogForm, setShowLogForm]   = useState(false);
  const [timerSec, setTimerSec]         = useState(0);
  const [timerOn, setTimerOn]           = useState(false);
  const [restSec, setRestSec]           = useState(60);
  const [restOn, setRestOn]             = useState(false);
  const [goalType, setGoalType]         = useState(() => load(userKey("gymGoalType"), () => getProfile().goal || "lose"));

  // persist
  useEffect(() => { save(userKey("gymWeight"), weightKg); }, [weightKg]);
  useEffect(() => { save(userKey("gymHeight"), heightCm); }, [heightCm]);
  useEffect(() => { save(userKey("gymTarget"), targetKg); }, [targetKg]);
  useEffect(() => { save(userKey("gymHistory"), history); }, [history]);
  useEffect(() => { save(userKey("gymCalTotal"), calories); }, [calories]);
  useEffect(() => { save(userKey("gymStreak"), streak); }, [streak]);
  useEffect(() => { save(userKey("gymGoalType"), goalType); }, [goalType]);
  useEffect(() => {
    save(userKey("gymWater"), water);
    save(userKey("gymWaterDate"), todayStr());
  }, [water]);

  // workout timer
  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setTimerSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  // rest timer
  useEffect(() => {
    if (!restOn) return;
    if (restSec <= 0) { setRestOn(false); return; }
    const id = setInterval(() => setRestSec(s => {
      if (s <= 1) { setRestOn(false); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [restOn, restSec]);

  const bmi = (weightKg / ((heightCm / 100) ** 2)).toFixed(1);
  const bmiLabel = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

  const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleMarkDone = () => {
    if (todayDone) return;
    save(userKey("gymTodayDone"), todayStr());
    setTodayDone(true);
    setStreak(s => s + 1);
    setCalories(c => c + 250);
    const entry = { date: new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }), name: todayWorkout.label };
    setHistory(h => [entry, ...h]);
    setCongrats(true);
    setTimeout(() => setCongrats(false), 3500);
  };

  const handleSaveWeight = () => {
    const n = parseFloat(weightInput);
    if (isNaN(n) || n <= 0) return;
    setWeightKg(n);
    setShowWeightSave(false);
  };

  const handleSaveHeight = () => {
    const n = parseFloat(heightInput);
    if (isNaN(n) || n <= 0) return;
    setHeightCm(n);
    setShowHeightSave(false);
  };

  const handleLogWorkout = (e) => {
    e.preventDefault();
    const name = logName.trim() || "Workout";
    const entry = { date: new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }), name };
    setHistory(h => [entry, ...h]);
    setCalories(c => c + 180);
    setLogName("");
    setShowLogForm(false);
  };

  const earnedBadges = new Set();
  if (history.length >= 1) earnedBadges.add("first");
  if (streak >= 7) earnedBadges.add("week");
  if (history.length >= 10) earnedBadges.add("ten");

  const tabs = [
    { id: "home",      label: "🏠 Home" },
    { id: "workout",   label: "🏋️ Workout" },
    { id: "progress",  label: "📊 Progress" },
    { id: "diet",      label: "🍎 Diet" },
    { id: "timer",     label: "⏱️ Timer" },
    { id: "goals",     label: "🎯 Goals" },
    { id: "profile",   label: "👤 Profile" },
  ];

  return (
    <div className="ud">
      {/* congrats overlay */}
      {congrats && (
        <div className="ud-congrats">
          <div className="ud-congrats-box">
            <div className="ud-congrats-emoji">🎉</div>
            <h2>Workout Done!</h2>
            <p>Congrats bro, you crushed it today! 💪</p>
            <p className="ud-congrats-sub">+250 kcal burned • Streak: {streak} days 🔥</p>
          </div>
        </div>
      )}

      {/* header */}
      <header className="ud-header">
        <div className="ud-header-left">
          <span className="ud-logo">⚡ Ragnarok</span>
          <span className="ud-greeting">Hey, {user.name.split(" ")[0]} 👋</span>
        </div>
        <div className="ud-header-right">
          <span className={`ud-badge-mem ${user.membership === "Active" ? "active" : "inactive"}`}>
            {user.membership === "Active" ? "✅ Active" : "❌ Inactive"}
          </span>
          <Link to="/login" className="ud-logout">Logout</Link>
        </div>
      </header>

      {/* tab nav */}
      <nav className="ud-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`ud-tab ${activeTab === t.id ? "ud-tab-active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main className="ud-main">

        {/* ===== HOME ===== */}
        {activeTab === "home" && (
          <div className="ud-section">
            <div className="ud-today-card">
              <div className="ud-today-day">{todayDay}</div>
              <div className="ud-today-label">{todayWorkout.label}</div>
              <ul className="ud-today-list">
                {todayWorkout.exercises.map((ex, i) => <li key={i}>{ex}</li>)}
              </ul>
              <button className={`ud-btn-primary ${todayDone ? "ud-btn-done" : ""}`} onClick={handleMarkDone} disabled={todayDone}>
                {todayDone ? "✅ Done for today!" : "✅ Mark as Done"}
              </button>
            </div>

            <div className="ud-stats-grid">
              <div className="ud-stat-card">
                <div className="ud-stat-icon">🔥</div>
                <div className="ud-stat-val">{calories}</div>
                <div className="ud-stat-lbl">kcal burned</div>
              </div>
              <div className="ud-stat-card">
                <div className="ud-stat-icon">📅</div>
                <div className="ud-stat-val">{streak}</div>
                <div className="ud-stat-lbl">day streak</div>
              </div>
              <div className="ud-stat-card">
                <div className="ud-stat-icon">⚖️</div>
                <div className="ud-stat-val">{weightKg}</div>
                <div className="ud-stat-lbl">kg weight</div>
              </div>
              <div className="ud-stat-card">
                <div className="ud-stat-icon">📐</div>
                <div className="ud-stat-val">{bmi}</div>
                <div className="ud-stat-lbl">BMI ({bmiLabel})</div>
              </div>
            </div>

            <div className="ud-water-section">
              <div className="ud-water-header">
                <span>💧 Water Intake</span>
                <span className="ud-water-count">{water} / 8 glasses</span>
              </div>
              <div className="ud-water-glasses">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button key={i} className={`ud-glass ${i < water ? "ud-glass-filled" : ""}`} onClick={() => setWater(Math.min(8, i + 1))}>
                    💧
                  </button>
                ))}
              </div>
            </div>

            <div className="ud-motivation">
              <p>"The only bad workout is the one that didn't happen."</p>
            </div>
          </div>
        )}

        {/* ===== WORKOUT ===== */}
        {activeTab === "workout" && (
          <div className="ud-section">
            <h2 className="ud-sec-title">Weekly Plan</h2>
            <div className="ud-week-grid">
              {Object.entries(WORKOUTS).map(([day, w]) => (
                <div key={day} className={`ud-week-card ${day === todayDay ? "ud-week-today" : ""}`}>
                  <div className="ud-week-day">{day.slice(0,3)}</div>
                  <div className="ud-week-label">{w.label}</div>
                </div>
              ))}
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"24px"}}>Today – {todayWorkout.label}</h2>
            <div className="ud-exercise-list">
              {todayWorkout.exercises.map((ex, i) => (
                <div key={i} className="ud-exercise-item">
                  <span className="ud-ex-num">{i+1}</span>
                  <span>{ex}</span>
                </div>
              ))}
            </div>

            <div className="ud-log-section">
              <button className="ud-btn-outline" onClick={() => setShowLogForm(!showLogForm)}>
                + Log Custom Workout
              </button>
              {showLogForm && (
                <form className="ud-log-form" onSubmit={handleLogWorkout}>
                  <input placeholder="e.g. Chest Day, Morning Run..." value={logName} onChange={e => setLogName(e.target.value)} />
                  <button type="submit" className="ud-btn-primary">Save</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ===== PROGRESS ===== */}
        {activeTab === "progress" && (
          <div className="ud-section">
            <h2 className="ud-sec-title">Your Stats</h2>

            <div className="ud-progress-cards">
              <div className="ud-prog-card">
                <div className="ud-prog-label">Total Workouts</div>
                <div className="ud-prog-val">{history.length}</div>
              </div>
              <div className="ud-prog-card">
                <div className="ud-prog-label">Calories Burned</div>
                <div className="ud-prog-val">{calories} kcal</div>
              </div>
              <div className="ud-prog-card">
                <div className="ud-prog-label">Current Streak</div>
                <div className="ud-prog-val">{streak} 🔥</div>
              </div>
              <div className="ud-prog-card">
                <div className="ud-prog-label">BMI</div>
                <div className="ud-prog-val">{bmi} <span className="ud-prog-sub">({bmiLabel})</span></div>
              </div>
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"24px"}}>Weight Tracker</h2>
            <div className="ud-weight-section">
              <div className="ud-weight-display">
                <span className="ud-weight-big">{weightKg} kg</span>
                <span className="ud-weight-target">Target: {targetKg} kg</span>
              </div>
              <div className="ud-weight-inputs">
                <div className="ud-input-group">
                  <label>Current Weight (kg)</label>
                  <input type="number" step="0.1" value={weightInput}
                    onChange={e => { setWeightInput(e.target.value); setShowWeightSave(true); }} />
                  {showWeightSave && (
                    <button className="ud-btn-primary ud-save-inline" onClick={handleSaveWeight}>
                      💾 Save Weight
                    </button>
                  )}
                </div>
                <div className="ud-input-group">
                  <label>Height (cm)</label>
                  <input type="number" step="1" value={heightInput}
                    onChange={e => { setHeightInput(e.target.value); setShowHeightSave(true); }} />
                  {showHeightSave && (
                    <button className="ud-btn-primary ud-save-inline" onClick={handleSaveHeight}>
                      💾 Save Height
                    </button>
                  )}
                </div>
                <div className="ud-input-group">
                  <label>Target Weight (kg)</label>
                  <input type="number" step="0.1" value={targetInput}
                    onChange={e => { setTargetInput(e.target.value); setTargetKg(parseFloat(e.target.value) || targetKg); }} />
                </div>
              </div>
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"24px"}}>Workout History</h2>
            {history.length === 0 ? (
              <p className="ud-muted">No workouts logged yet. Get moving! 🏃</p>
            ) : (
              <div className="ud-history-list">
                {history.slice(0, 15).map((row, i) => (
                  <div key={i} className="ud-history-item">
                    <span className="ud-history-date">{row.date}</span>
                    <span className="ud-history-name">{row.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== DIET ===== */}
        {activeTab === "diet" && (
          <div className="ud-section">
            <h2 className="ud-sec-title">Daily Meal Plan 🍱</h2>
            <p className="ud-muted" style={{marginBottom:"16px"}}>Budget-friendly Indian meals (~1700 kcal/day)</p>
            <div className="ud-meals">
              {MEAL_PLANS.map((m, i) => (
                <div key={i} className="ud-meal-card">
                  <div className="ud-meal-time">{m.time}</div>
                  <div className="ud-meal-name">{m.meal}</div>
                  <div className="ud-meal-macros">
                    <span>🔥 {m.cal} kcal</span>
                    <span>🥩 {m.p}g protein</span>
                    <span>🍚 {m.c}g carbs</span>
                    <span>🧈 {m.f}g fat</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="ud-macro-total">
              <h3>Today's Total</h3>
              <div className="ud-macro-bars">
                <div className="ud-macro-row">
                  <span>Protein</span>
                  <div className="ud-bar-wrap"><div className="ud-bar ud-bar-p" style={{width:"84%"}}></div></div>
                  <span>84g</span>
                </div>
                <div className="ud-macro-row">
                  <span>Carbs</span>
                  <div className="ud-bar-wrap"><div className="ud-bar ud-bar-c" style={{width:"100%"}}></div></div>
                  <span>223g</span>
                </div>
                <div className="ud-macro-row">
                  <span>Fats</span>
                  <div className="ud-bar-wrap"><div className="ud-bar ud-bar-f" style={{width:"44%"}}></div></div>
                  <span>44g</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== TIMER ===== */}
        {activeTab === "timer" && (
          <div className="ud-section">
            <h2 className="ud-sec-title">Workout Timer ⏱️</h2>
            <div className="ud-timer-card">
              <div className="ud-timer-display">{fmtTime(timerSec)}</div>
              <div className="ud-timer-btns">
                <button className="ud-btn-primary" onClick={() => setTimerOn(!timerOn)}>
                  {timerOn ? "⏸ Pause" : "▶ Start"}
                </button>
                <button className="ud-btn-outline" onClick={() => { setTimerOn(false); setTimerSec(0); }}>
                  🔄 Reset
                </button>
              </div>
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"28px"}}>Rest Timer 😮‍💨</h2>
            <div className="ud-timer-card">
              <div className={`ud-timer-display ${restSec <= 10 && restOn ? "ud-timer-warn" : ""}`}>
                {fmtTime(restSec)}
              </div>
              <div className="ud-rest-presets">
                {[30, 60, 90, 120].map(s => (
                  <button key={s} className="ud-btn-outline ud-preset" onClick={() => { setRestSec(s); setRestOn(false); }}>
                    {s}s
                  </button>
                ))}
              </div>
              <div className="ud-timer-btns">
                <button className="ud-btn-primary" onClick={() => setRestOn(!restOn)} disabled={restSec === 0}>
                  {restOn ? "⏸ Pause" : "▶ Start Rest"}
                </button>
                <button className="ud-btn-outline" onClick={() => { setRestOn(false); setRestSec(60); }}>
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== GOALS ===== */}
        {activeTab === "goals" && (
          <div className="ud-section">
            <h2 className="ud-sec-title">My Goal</h2>
            <div className="ud-goal-options">
              {[
                { id: "lose",     icon: "📉", label: "Lose Weight" },
                { id: "gain",     icon: "📈", label: "Gain Muscle" },
                { id: "maintain", icon: "⚖️", label: "Stay Fit" },
              ].map(g => (
                <button key={g.id} className={`ud-goal-btn ${goalType === g.id ? "ud-goal-active" : ""}`} onClick={() => setGoalType(g.id)}>
                  <span className="ud-goal-icon">{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"24px"}}>Achievements 🏆</h2>
            <div className="ud-badges">
              {BADGES.map(b => (
                <div key={b.id} className={`ud-badge-card ${earnedBadges.has(b.id) ? "ud-badge-earned" : "ud-badge-locked"}`}>
                  <div className="ud-badge-icon">{earnedBadges.has(b.id) ? b.icon : "🔒"}</div>
                  <div className="ud-badge-label">{b.label}</div>
                  <div className="ud-badge-desc">{b.desc}</div>
                </div>
              ))}
            </div>

            <h2 className="ud-sec-title" style={{marginTop:"24px"}}>Weekly Challenge</h2>
            <div className="ud-challenge-card">
              <div className="ud-challenge-title">💪 Workout 5 days this week</div>
              <div className="ud-challenge-progress">
                <div className="ud-challenge-bar" style={{width: `${Math.min(100, (streak / 5) * 100)}%`}}></div>
              </div>
              <div className="ud-challenge-count">{Math.min(streak, 5)} / 5 days</div>
            </div>
          </div>
        )}

        {/* ===== PROFILE ===== */}
        {activeTab === "profile" && (
          <div className="ud-section">
            <div className="ud-profile-header">
              <div className="ud-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <div className="ud-profile-name">{user.name}</div>
                <div className={`ud-mem-status ${user.membership === "Active" ? "mem-active" : "mem-inactive"}`}>
                  Membership: {user.membership}
                  <span className="ud-mem-note"> (set by owner)</span>
                </div>
              </div>
            </div>

            <div className="ud-profile-stats">
              <div className="ud-ps-item"><span>Total Workouts</span><strong>{history.length}</strong></div>
              {user.age && <div className="ud-ps-item"><span>Age</span><strong>{user.age} yrs</strong></div>}
              <div className="ud-ps-item"><span>Current Weight</span><strong>{weightKg} kg</strong></div>
              <div className="ud-ps-item"><span>Height</span><strong>{heightCm} cm</strong></div>
              <div className="ud-ps-item"><span>BMI</span><strong>{bmi} ({bmiLabel})</strong></div>
              <div className="ud-ps-item"><span>Goal</span><strong>{goalType === "lose" ? "Lose Weight" : goalType === "gain" ? "Gain Muscle" : "Stay Fit"}</strong></div>
              <div className="ud-ps-item"><span>Streak</span><strong>{streak} days 🔥</strong></div>
            </div>

            <div className="ud-profile-links">
              <Link to="/" className="ud-btn-outline">← Back to Home</Link>
              <Link to="/login" className="ud-btn-outline ud-btn-red">Logout</Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
