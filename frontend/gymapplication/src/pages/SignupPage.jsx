import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Enter your name");
      return;
    }
    if (!email.includes("@")) {
      setErr("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      setErr("Password at least 6 characters");
      return;
    }
    localStorage.setItem(
      "gymUser",
      JSON.stringify({ name: name.trim(), membership: "Active", photoUrl: "" })
    );
    navigate("/userdashboard");
  };

  return (
    <div className="signup-page">
      <div className="signup-center">
        <Link to="/" className="signup-back">
          ← Back to home
        </Link>
        <div className="signup-card">
          <h1>Sign up</h1>
          <p className="signup-sub">Create an account for the demo dashboard</p>
          <form className="signup-form" onSubmit={submit}>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErr("");
              }}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr("");
              }}
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErr("");
              }}
            />
            {err ? <p className="signup-err">{err}</p> : null}
            <button type="submit" className="signup-btn">
              Create account
            </button>
          </form>
          <p className="signup-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
