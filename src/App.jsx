import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Home from "./Home";
import About from "./About";
import AllColleges from "./AllColleges";
import CollegeDetails from "./CollegeDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/all-colleges" element={<AllColleges />} />
      <Route path="/college/:collegeName" element={<CollegeDetails />} />
    </Routes>
  );
}

export default App;