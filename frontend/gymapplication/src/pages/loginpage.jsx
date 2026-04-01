import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    adminId: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔥 Reset fields when switching role
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm({
      email: "",
      password: "",
      adminId: ""
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

    // 🔥 Simulate login success
    if (role === "user") {
      console.log("User Login:", form);
    } else {
      console.log("Admin Login:", form);
    }

    // ✅ Redirect after login
    navigate("/home");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.logo}>RagnarokFitness</h1>

        {/* Toggle */}
        <div style={styles.toggle}>
          <div
            style={{
              ...styles.slider,
              transform: role === "admin" ? "translateX(100%)" : "translateX(0%)"
            }}
          />
          <button
            type="button"
            onClick={() => handleRoleChange("user")}
            style={styles.toggleBtn}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("admin")}
            style={styles.toggleBtn}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Dynamic Input */}
          {role === "user" ? (
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          ) : (
            <input
              type="text"
              name="adminId"
              placeholder="Enter Admin ID"
              value={form.adminId}
              onChange={handleChange}
              style={styles.input}
              required
            />
          )}

          {/* Password */}
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <span
              style={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Error */}
          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.loginBtn}>
            {role === "user" ? "Login as User" : "Login as Admin"}
          </button>
        </form>

        <p style={styles.footer}>
          {role === "user"
            ? "New member? Sign up"
            : "Restricted access • Admin only"}
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
  },

  card: {
    width: "480px",
    padding: "40px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
  },

  logo: {
    marginBottom: "20px",
    color: "#ff4d4d",
    letterSpacing: "2px"
  },

  toggle: {
    position: "relative",
    display: "flex",
    background: "#222",
    borderRadius: "30px",
    marginBottom: "20px",
    overflow: "hidden"
  },

  slider: {
    position: "absolute",
    width: "50%",
    height: "100%",
    background: "#ff4d4d",
    borderRadius: "30px",
    transition: "0.3s"
  },

  toggleBtn: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    color: "#fff",
    border: "none",
    zIndex: 1,
    cursor: "pointer"
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#111",
    color: "#fff"
  },

  passwordWrapper: {
    position: "relative"
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer"
  },

  error: {
    color: "#ff4d4d",
    fontSize: "13px",
    marginBottom: "10px"
  },

  loginBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#ff4d4d",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  },

  footer: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#ccc"
  }
};


export default LoginPage;