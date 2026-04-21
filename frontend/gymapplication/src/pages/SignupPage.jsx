import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

export default function SignupPage() {
  const navigate = useNavigate();

  // step 1 = account details, step 2 = profile setup
  const [step, setStep] = useState(1);
  const [err, setErr] = useState("");

  // step 1 fields
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // step 2 fields
  const [age, setAge]         = useState("");
  const [weightKg, setWeight] = useState("");
  const [heightCm, setHeight] = useState("");
  const [goal, setGoal]       = useState("maintain");

  const GOALS = [
    { id: "lose",     icon: "📉", label: "Lose Weight" },
    { id: "gain",     icon: "📈", label: "Gain Muscle" },
    { id: "maintain", icon: "⚖️", label: "Stay Fit" },
  ];

  const handleStep1 = (e) => {
    e.preventDefault();
    setErr("");
    if (!name.trim())            return setErr("Enter your name");
    if (!email.includes("@"))    return setErr("Enter a valid email");
    if (password.length < 6)     return setErr("Password must be at least 6 characters");

    // check if email already registered
    const existing = localStorage.getItem(`gymProfile_${email.toLowerCase().trim()}`);
    if (existing) return setErr("Account already exists with this email. Please login.");

    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setErr("");
    if (!age || isNaN(age) || age < 10 || age > 100) return setErr("Enter a valid age");
    if (!weightKg || isNaN(weightKg) || weightKg <= 0) return setErr("Enter a valid weight");
    if (!heightCm || isNaN(heightCm) || heightCm <= 0) return setErr("Enter a valid height");

    const key = email.toLowerCase().trim();

    // save full profile under email key
    const profile = {
      name:       name.trim(),
      email:      key,
      password,                        // plain text — demo only, no backend yet
      membership: "Active",
      photoUrl:   "",
      age:        Number(age),
      weightKg:   Number(weightKg),
      heightCm:   Number(heightCm),
      goal,
      createdAt:  new Date().toISOString(),
    };

    localStorage.setItem(`gymProfile_${key}`, JSON.stringify(profile));

    // set as active session
    localStorage.setItem("gymActiveEmail", key);

    // seed per-user data keys
    localStorage.setItem(`gymWeight_${key}`,   String(weightKg));
    localStorage.setItem(`gymHeight_${key}`,   String(heightCm));
    localStorage.setItem(`gymTarget_${key}`,   String(weightKg));
    localStorage.setItem(`gymGoalType_${key}`, goal);
    localStorage.setItem(`gymStreak_${key}`,   "0");
    localStorage.setItem(`gymCalTotal_${key}`, "0");
    localStorage.setItem(`gymHistory_${key}`,  "[]");

    navigate("/userdashboard");
  };

  return (
    <div className="signup-page">
      <div className="signup-center">
        <Link to="/" className="signup-back">← Back to home</Link>

        <div className="signup-card">

          {/* step indicator */}
          <div className="signup-steps">
            <div className={`signup-step-dot ${step >= 1 ? "active" : ""}`}>1</div>
            <div className="signup-step-line" />
            <div className={`signup-step-dot ${step >= 2 ? "active" : ""}`}>2</div>
          </div>

          {step === 1 && (
            <>
              <h1>Create Account</h1>
              <p className="signup-sub">Step 1 of 2 — Account details</p>
              <form className="signup-form" onSubmit={handleStep1}>
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={e => { setName(e.target.value); setErr(""); }}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErr(""); }}
                />
                <div className="signup-pass-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErr(""); }}
                  />
                  <span className="signup-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </span>
                </div>
                {err && <p className="signup-err">{err}</p>}
                <button type="submit" className="signup-btn">Next →</button>
              </form>
              <p className="signup-footer">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1>Your Profile</h1>
              <p className="signup-sub">Step 2 of 2 — Tell us about yourself</p>
              <form className="signup-form" onSubmit={handleStep2}>

                <div className="signup-row">
                  <div className="signup-field">
                    <label>Age</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={age}
                      min="10" max="100"
                      onChange={e => { setAge(e.target.value); setErr(""); }}
                    />
                  </div>
                  <div className="signup-field">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      placeholder="e.g. 70"
                      value={weightKg}
                      step="0.1"
                      onChange={e => { setWeight(e.target.value); setErr(""); }}
                    />
                  </div>
                </div>

                <div className="signup-field" style={{marginBottom:"14px"}}>
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 175"
                    value={heightCm}
                    step="1"
                    onChange={e => { setHeight(e.target.value); setErr(""); }}
                  />
                </div>

                <label className="signup-goal-label">What's your goal?</label>
                <div className="signup-goals">
                  {GOALS.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      className={`signup-goal-btn ${goal === g.id ? "selected" : ""}`}
                      onClick={() => setGoal(g.id)}
                    >
                      <span>{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>

                {err && <p className="signup-err">{err}</p>}

                <div className="signup-step2-btns">
                  <button type="button" className="signup-btn-back" onClick={() => { setStep(1); setErr(""); }}>
                    ← Back
                  </button>
                  <button type="submit" className="signup-btn">
                    Let's Go 💪
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
