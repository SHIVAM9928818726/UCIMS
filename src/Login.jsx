import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ShieldCheck, Lock, LogIn, Mail, LogOut, User } from "lucide-react";
import "./Login.css";

function Login() {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const email = credentials.email.trim();
    const password = credentials.password.trim();

    if (!email || !password) {
      setErrormsg("Please enter correct Email or Password");
      return;
    }
    setIsLoading(true);

    setErrormsg("");

    setTimeout(() => {
      setIsLoading(false);

      if (isAdminMode) {
        if (email === "gaurshivam775@gmail.com" && password === "Shivu@123") {
          const adminData = {
            name: "Admin",
            email: email,
            picture: "https://cdn-icons-png.flaticon.com/512/863/863823.png",
            role: "admin",
          };
          setUser(adminData);
          localStorage.setItem("user", JSON.stringify(adminData));
          localStorage.setItem("adminLoggedIn", "true");
          navigate("/user-admin");
        } else {
          alert("Invalid Admin Credentials!");
        }
        return;
      }

      // Gmail validation regex for students
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

      if (!gmailRegex.test(email)) {
        alert("Login Failed! Please enter a valid Gmail ID (example@gmail.com)");
        return;
      }

      const userData = {
        name: email.split("@")[0],
        email: email,
        picture: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/home");
    }, 1500);
  };

  return (
    <div className="login-page-container">
      {/* Background Particles */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="login-box">
        {!user ? (
          <>
            <div className="login-toggle-container">
              <button
                type="button"
                className={`login-toggle-btn ${!isAdminMode ? "active" : ""}`}
                onClick={() => setIsAdminMode(false)}
              >Student</button>
              <button
                type="button"
                className={`login-toggle-btn ${isAdminMode ? "active" : ""}`}
                onClick={() => setIsAdminMode(true)}
              >Admin</button>
            </div>

            <h2 className="login-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {isAdminMode ? <ShieldCheck size={28} color="#3b82f6" /> : <Lock size={28} color="#3b82f6" />}
              {isAdminMode ? "Admin Login" : "Login"}
            </h2>

            {/* Manual Login */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <input
                  type="text"
                  name="email"
                  className="login-input"
                  placeholder={isAdminMode ? "Enter Admin Email" : "Enter Gmail Address"}
                  value={credentials.email}
                  onChange={handleChange}
                  autoComplete="off"
                />

                <input
                  type="password"
                  name="password"
                  className="login-input"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>

              {errormsg && <p className="login-error-msg">{errormsg}</p>}

              <button 
                type="submit" 
                disabled={isLoading} 
                className="login-main-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {isLoading ? "Logging in..." : <><LogIn size={18} /> Continue to Dashboard</>}
              </button>
            </form>

            {!isAdminMode && (
              <>
                <hr className="login-divider" />
                {/* Google Login Center */}
                <div className="google-login-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      const decoded = jwtDecode(credentialResponse.credential);
                      setUser(decoded);
                      localStorage.setItem("user", JSON.stringify(decoded));
                      navigate("/home");
                    }}
                    onError={() => {
                      alert("Google Login Failed!");
                    }}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2 className="login-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <User size={28} color="#3b82f6" /> Welcome Back
            </h2>

            <img
              src={user.picture || "https://cdn-icons-png.flaticon.com/512/281/281769.png"}
              alt="profile"
              className="profile-image"
            />

            <div className="profile-info">
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
            </div>

            <button className="logout-main-btn" onClick={logout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LogOut size={18} /> Secure Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
