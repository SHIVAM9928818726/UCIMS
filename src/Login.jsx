import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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
          navigate("/home");
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
    <div className="page-container" style={styles.body}>
      <div style={styles.box}>
        {!user ? (
          <>
            <div style={styles.toggleContainer}>
              <button
                type="button"
                style={!isAdminMode ? styles.activeToggle : styles.inactiveToggle}
                onClick={() => setIsAdminMode(false)}
              >Student</button>
              <button
                type="button"
                style={isAdminMode ? styles.activeToggle : styles.inactiveToggle}
                onClick={() => setIsAdminMode(true)}
              >Admin</button>
            </div>

            <h2 style={styles.title}>{isAdminMode ? "🛡️ Admin Login" : "🔐 Login with Gmail"}</h2>

            {/* Manual Login */}
            <form onSubmit={handleLogin} style={{ marginBottom: "15px" }}>
              <input
                type="text"
                name="email"
                placeholder={isAdminMode ? "Enter Admin Email" : "Gmail"}
                value={credentials.email}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                style={styles.input}
              />

              {errormsg && <p style={{ color: "red" }}>{errormsg}</p>}

              <br />

              <button type="submit" disabled={isLoading} style={{ ...styles.loginBtn, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {!isAdminMode && (
              <>
                <hr style={{ margin: "20px 0" }} />

                {/* Google Login */}
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
              </>
            )}
          </>
        ) : (
          <>
            <h2 style={styles.heading}>🎓 Welcome</h2>

            <img
              src={
                user.picture ||
                "https://cdn-icons-png.flaticon.com/512/281/281769.png"
              }
              alt="profile"
              style={styles.img}
            />

            <p style={styles.text}>
              <b>Name:</b> {user.name}
            </p>

            <p style={styles.text}>
              <b>Email:</b> {user.email}
            </p>

            <button style={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;

const styles = {
  body: {
    fontFamily: "Segoe UI, sans-serif",
    backgroundImage:
      'url("https://www.gits.ac.in/wp-content/uploads/2016/01/blurred.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    background: "rgba(255,255,255,0.95)",
    padding: "30px",
    borderRadius: "15px",
    width: "360px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },

  title: {
    background: "linear-gradient(90deg, #6b08cd, #a2acd8)",
    padding: "10px",
    borderRadius: "8px",
    color: "white",
    marginBottom: "20px",
    fontSize: "20px",
  },

  input: {
    width: "80%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #6b08cd",
    fontSize: "14px",
    outline: "none",
    boxShadow: "0 2px 5px rgba(107, 8, 205, 0.2)",
  },

  loginBtn: {
    width: "60%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    background: "#6b08cd",
    color: "white",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "22px",
  },

  text: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },

  img: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    marginTop: "10px",
    border: "2px solid #ccc",
  },

  logoutBtn: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    background: "#ff4b5c",
    color: "white",
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    background: "#f0f0f0",
    borderRadius: "8px",
    overflow: "hidden"
  },
  activeToggle: {
    flex: 1,
    padding: "10px",
    background: "#6b08cd",
    color: "white",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  },
  inactiveToggle: {
    flex: 1,
    padding: "10px",
    background: "transparent",
    color: "#555",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  }
};
