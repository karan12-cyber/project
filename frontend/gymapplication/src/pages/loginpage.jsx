import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    adminId: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm({
      email: "",
      password: "",
      adminId: "",
    });
    setError("");
  };

  const validate = () => {
    if (role === "user" && !form.email.includes("@")) {
      return "Please enter a valid email";
    }
    if (role === "admin" && form.adminId.trim().length < 4) {
      return "Admin ID must be at least 4 characters";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (role === "user") {
      console.log("User Login:", form);
    } else {
      console.log("Admin Login:", form);
    }

    if (role === "user") {
      const key = form.email.toLowerCase().trim();
      const profile = (() => {
        try { return JSON.parse(localStorage.getItem(`gymProfile_${key}`) || "null"); }
        catch { return null; }
      })();

      if (!profile) {
        setError("No account found. Please sign up first.");
        return;
      }

      if (profile.password !== form.password) {
        setError("Wrong password.");
        return;
      }

      // set active session
      localStorage.setItem("gymActiveEmail", key);
      navigate("/userdashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__center">
        <Link to="/" className="login-back">
          ← Back to home
        </Link>

        <div className="login-card">
        <h1>Ragnarok.Fitness</h1>
        <p className="login-sub">Login to open your dashboard</p>

        <div className="login-toggle">
          <div
            className="login-toggle-slider"
            style={{ transform: role === "admin" ? "translateX(100%)" : "translateX(0)" }}
          />
          <button
            type="button"
            className={role === "user" ? "active" : ""}
            onClick={() => handleRoleChange("user")}
          >
            User
          </button>
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {role === "user" ? (
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
          ) : (
            <input
              type="text"
              name="adminId"
              placeholder="Enter Admin ID"
              value={form.adminId}
              onChange={handleChange}
              required
            />
          )}

          <div className="login-password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span className="eye" onClick={() => setShowPassword(!showPassword)} role="button" tabIndex={0}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit">
            {role === "user" ? "Login as User" : "Login as Admin"}
          </button>
        </form>

        <p className="login-footer">
          {role === "user" ? (
            <>
              New member? <Link to="/signup">Sign up</Link>
            </>
          ) : (
            "Admin access only"
          )}
        </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
