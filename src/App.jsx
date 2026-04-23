import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Home from "./Home";
import About from "./About";
import AllColleges from "./AllColleges";
import CollegeDetails from "./CollegeDetails";
import UserAdmin from "./UserAdmin";
import AdminLogin from "./AdminLogin";

// Protected Route Component for Admin
const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  return isAdminLoggedIn ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/all-colleges" element={<AllColleges />} />
      <Route path="/college/:collegeName" element={<CollegeDetails />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route 
        path="/user-admin" 
        element={
          <ProtectedRoute>
            <UserAdmin />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;