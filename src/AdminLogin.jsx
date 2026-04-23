import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertTriangle, LogIn, ArrowLeft } from "lucide-react";
import "./AdminLogin.css";

function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (
        email === "gaurshivam775@gmail.com" &&
        password === "Shivu@123"
      ) {
        const adminData = {
          name: "Admin",
          email,
          picture: "https://cdn-icons-png.flaticon.com/512/863/863823.png",
          role: "admin",
        };
        localStorage.setItem("user", JSON.stringify(adminData));
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/user-admin");
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="admin-login-container">
      {/* Background Grid */}
      <div className="al-bg-grid" />

      {/* Glowing Orbs */}
      <div className="al-orbs">
        <div className="al-orb al-orb-1" />
        <div className="al-orb al-orb-2" />
        <div className="al-orb al-orb-3" />
      </div>

      {/* Floating Particles */}
      <div className="al-particles">
        <div className="al-particle al-p1" />
        <div className="al-particle al-p2" />
        <div className="al-particle al-p3" />
        <div className="al-particle al-p4" />
        <div className="al-particle al-p5" />
        <div className="al-particle al-p6" />
        <div className="al-particle al-p7" />
        <div className="al-particle al-p8" />
      </div>

      {/* Card */}
      <div className="al-card">
        <div className="al-card-glow-line" />

        {/* Header */}
        <div className="al-header">
          <div className="al-shield-wrap">
            <ShieldCheck size={40} color="#3b82f6" strokeWidth={1.5} />
            <div className="al-shield-ring" />
          </div>
          <div className="al-brand-row">
            <span className="al-brand-ucims">UCIMS</span>
            <span className="al-brand-badge">ADMIN</span>
          </div>
          <h1 className="al-title">Secure Admin Access</h1>
          <p className="al-subtitle">Authorised personnel only</p>
        </div>

        {/* Form */}
        <form className="al-form" onSubmit={handleSubmit}>
          <div className="al-input-group">
            <label htmlFor="al-email" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} /> Admin Email
            </label>
            <div className="al-input-wrap">
              <input
                id="al-email"
                type="text"
                name="email"
                placeholder="admin@ucims.com"
                value={credentials.email}
                onChange={handleChange}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="al-input-group">
            <label htmlFor="al-password" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} /> Password
            </label>
            <div className="al-input-wrap al-pw-wrap">
              <input
                id="al-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="al-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="al-error" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="al-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="al-loading">
                <span className="al-spinner" /> Authenticating...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <LogIn size={20} /> Access Dashboard
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="al-footer">
          <div className="al-divider">or</div>
          <button
            className="al-back-btn"
            onClick={() => navigate("/")}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}
          >
            <ArrowLeft size={18} /> Back to Student Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
