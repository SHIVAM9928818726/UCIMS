import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Home as HomeIcon, School, BarChart2, Info, LogOut, Star, Building2, Banknote, Trophy, MapPin, Phone, Mail } from "lucide-react";
import CollegeCard from "./CollegeCard";
import "./Home.css";

// Background Images for Slider
import bg1 from "./assets/backgrounds/bg1.png";
import bg2 from "./assets/backgrounds/bg2.png";
import bg3 from "./assets/backgrounds/bg3.png";
import bg4 from "./assets/backgrounds/bg4.png";
import bg5 from "./assets/backgrounds/bg5.png";
import bg6 from "./assets/backgrounds/bg6.png";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [stats, setStats] = useState({ total_colleges: 0, total_states: 0, total_tier1: 0, total_tier2: 0, total_tier3: 0 });
  const [updates, setUpdates] = useState([]);
  const [compareData, setCompareData] = useState({ col1: null, col2: null });
  const [selectedCol1, setSelectedCol1] = useState("");
  const [selectedCol2, setSelectedCol2] = useState("");
  const [filters, setFilters] = useState({ state: "", city: "", course: "", tier: "", college_type: "", search: "", sort: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
    fetchStats();
    fetchUpdates();
    fetchAllCollegesList();
  }, [filters]);


  const fetchAllCollegesList = async () => {
    try {
      const res = await fetch("/api/all_colleges");
      const data = await res.json();
      setAllColleges(data);
    } catch (e) { console.error(e); }
  };

  const fetchColleges = async (customFilter = null) => {
    try {
      const activeFilters = customFilter || filters;
      const params = new URLSearchParams();
      Object.keys(activeFilters).forEach(key => {
        if (activeFilters[key]) params.append(key, activeFilters[key]);
      });
      const res = await fetch(`/api/colleges?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setColleges(data);
    } catch (e) { console.error(e); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  };

  const fetchUpdates = async () => {
    try {
      const res = await fetch("/api/latest_updates");
      const data = await res.json();
      setUpdates(data);
    } catch (e) { console.error(e); }
  };

  // handle the search button
  const handleSearch = () => {
    // Requirement check: Warning if everything is empty
    const isAllEmpty = !filters.search.trim() && !filters.tier && !filters.college_type && !filters.sort;

    if (isAllEmpty) {
      setError("⚠ Warning: Something went wrong. Please select it properly.");
      return;
    }

    setError(""); // clear error

    // Construct query params
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.tier) params.append("tier", filters.tier);
    if (filters.college_type) params.append("college_type", filters.college_type);
    if (filters.sort) params.append("sort", filters.sort);

    navigate(`/all-colleges?${params.toString()}`);
  };

  const handleCompare = async () => {
    if (!selectedCol1 || !selectedCol2) return alert("Select both colleges!");
    try {
      const res = await fetch(`/api/compare?college1=${selectedCol1}&college2=${selectedCol2}`);
      const data = await res.json();
      setCompareData({ col1: data.college1, col2: data.college2 });
    } catch (e) { console.error(e); }
  };

  const formatValue = (val, type) => {
    const isInvalid = (v) =>
      v === null || v === undefined || v === "" ||
      String(v).toLowerCase() === "nan" ||
      String(v).trim() === "--" ||
      String(v).trim() === "-";

    if (isInvalid(val)) {
      return "Info Unavailable";
    }

    // Clean symbols and commas
    let cleanVal = String(val).replace(/[₹,]/g, "").trim();

    // Handle LPA suffix
    const hasLPA = cleanVal.toLowerCase().includes("lpa");
    let numStr = hasLPA ? cleanVal.toLowerCase().replace("lpa", "").trim() : cleanVal;

    // Check if it's actually numeric
    const parsedNum = parseFloat(numStr);
    if (isNaN(parsedNum)) return val || "Info Unavailable";

    if (type === 'fee') {
      return `₹ ${parsedNum.toLocaleString('en-IN')}`;
    }
    if (type === 'package') {
      return `₹ ${numStr} LPA`;
    }
    return val;
  };

  const collegeOptions = allColleges.map(c => ({
    value: c.id,
    label: c.College_Name,
    city: c.City,
    state: c.State
  }));

  const customFilter = (option, inputValue) => {
    const term = inputValue.toLowerCase();
    const { label, data } = option;
    return (
      label.toLowerCase().includes(term) ||
      (data.city && data.city.toLowerCase().includes(term)) ||
      (data.state && data.state.toLowerCase().includes(term))
    );
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minWidth: '280px',
      borderRadius: '8px',
      padding: '2px',
      border: 'none',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#2563eb' : isFocused ? '#eff6ff' : 'white',
      color: isSelected ? 'white' : 'black',
      cursor: 'pointer',
      textAlign: 'left'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1e3a8a',
      fontWeight: '500'
    })
  };

  const handleFilterChange = (e, manualValue = null) => {
    setError(""); // Clear error on interaction
    if (typeof e === 'string' && manualValue !== null) {
      // Handle manual name-value pair (e.g. for sort)
      setFilters(prev => ({ ...prev, [e]: manualValue }));
    } else if (e.target) {
      // Handle standard event
      setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleQuickFilter = (type, value) => {
    navigate(`/all-colleges?${type}=${value}`);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);      // scrolling in the place of ("sectionId") is located.
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });    // it help to scrolling the page.
    }
  };

  return (
    <div className="page-container ucims-home">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="http://localhost:5173/" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
         <img src="data:image/svg+xml;utf8,%3Csvg%20width%3D%2245%22%20height%3D%2245%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3C!--%20Outer%20Circle%20--%3E%0A%20%20%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2230%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%224%22%20fill%3D%22%230f172a%22%3E%3C%2Fcircle%3E%0A%0A%20%20%3C!--%20Graduation%20Cap%20--%3E%0A%20%20%3Cpath%20d%3D%22M16%2024L32%2016L48%2024L32%2032L16%2024Z%22%20fill%3D%22%2338bdf8%22%3E%3C%2Fpath%3E%0A%20%20%3Cpath%20d%3D%22M22%2028V36C22%2036%2028%2040%2032%2040C36%2040%2042%2036%2042%2036V28L32%2034L22%2028Z%22%20fill%3D%22%232563eb%22%3E%3C%2Fpath%3E%0A%0A%20%20%3C!--%20Data%20Bars%20--%3E%0A%20%20%3Crect%20x%3D%2220%22%20y%3D%2244%22%20width%3D%226%22%20height%3D%2210%22%20fill%3D%22%2338bdf8%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%20%20%3Crect%20x%3D%2229%22%20y%3D%2240%22%20width%3D%226%22%20height%3D%2214%22%20fill%3D%22%232563eb%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%20%20%3Crect%20x%3D%2238%22%20y%3D%2246%22%20width%3D%226%22%20height%3D%228%22%20fill%3D%22%2338bdf8%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%3C%2Fsvg%3E" alt="ucims logo"></img> <span>UCIMS</span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HomeIcon size={18} /> Home
            </Link>
          </li>
          {/* <li>
            <a href="#colleges" onClick={(e) => { e.preventDefault(); scrollToSection('colleges'); }}>
              <School size={18} /> Colleges
            </a>
          </li> */}
          <li>
            <Link to="http://localhost:5173/all-colleges" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <School size={18} /> Colleges
            </Link>

          </li>
          <li>
            <a href="#compare" onClick={(e) => { e.preventDefault(); scrollToSection('compare'); }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart2 size={18} /> Compare
            </a>
          </li>
          <li>
            <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={18} /> About
            </Link>
          </li>
        </ul>
        <div className="navbar-right-actions">
          <Link to="/" className="nav-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LogOut size={16} /> Logout</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Continuous Background Slider */}
        <div className="bg-slider">
          <div className="bg-track">
            {[bg1, bg2, bg3, bg4, bg5, bg6, bg1, bg2, bg3].map((img, i) => (
              <div key={i} className="bg-slide" style={{ backgroundImage: `url(${img})` }}></div>
            ))}
          </div>
          <div className="bg-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text-area">
            <h1 className="hero-title">Unified College Information and Management System</h1>
            <p className="hero-subtitle">Search, compare, and discover the best educational institutions with real metrics.</p>
          </div>

          <div className="search-container">
            <div className="search-input-group" style={{ width: "100%" }}>

              {/* Row: Search input + button */}
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="search-input"
                  placeholder="Search for college name or city..."
                  style={{ flex: 1, color: "#fdfafaff", opacity: "1" }}
                  autoComplete="off"
                  spellCheck="false"
                />

                <button className="search-btn" onClick={handleSearch}>
                  Search
                </button>
              </div>


              {/* Next Line: Error message */}
              {error && (
                <p style={{ color: "red", marginTop: "6px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "500" }}>
                  {error}
                </p>
              )}

            </div>

            <div className="filters-grid">
              <select name="tier" value={filters.tier} onChange={handleFilterChange} className="filter-select" >
                <option value="">All Tiers</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
              <select name="college_type" value={filters.college_type} onChange={handleFilterChange} className="filter-select">
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              <select name="sort" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="filter-select">
                <option value="">Sort By</option>
                <option value="ug_fee">Fees (Low to High)</option>
                <option value="avg_package">Avg Package</option>
                <option value="reality_score">Reality Score</option>
              </select>
            </div>
          </div>

          <div className="quick-filters">
            <div className="quick-filter-card" onClick={() => handleQuickFilter('tier', 'Tier 1')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Star size={18} color="#f59e0b" /> Tier 1 Colleges</div>
            <div className="quick-filter-card" onClick={() => handleQuickFilter('college_type', 'Government')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Building2 size={18} color="#3b82f6" /> Government Colleges</div>
            <div className="quick-filter-card" onClick={() => handleQuickFilter('sort', 'ug_fee')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Banknote size={18} color="#10b981" /> Low Fees</div>
            <div className="quick-filter-card" onClick={() => handleQuickFilter('sort', 'reality_score')} style={{display: 'flex', alignItems: 'center', gap: '8px'}}><Trophy size={18} color="#f59e0b" /> High Reality Score</div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner">
        <div className="stats-grid">
          <div className="stat-box clickable" onClick={() => navigate('/all-colleges')}>
            <div className="stat-number">{stats.total_colleges || 0}</div>
            <div className="stat-text">Total Colleges</div>
          </div>
          <div className="stat-box clickable" onClick={() => navigate('/all-colleges?tier=Tier 1')}>
            <div className="stat-number">{stats.total_tier1 || 0}</div>
            <div className="stat-text">Tier 1 Colleges</div>
          </div>
          <div className="stat-box clickable" onClick={() => navigate('/all-colleges?tier=Tier 2')}>
            <div className="stat-number">{stats.total_tier2 || 0}</div>
            <div className="stat-text">Tier 2 Colleges</div>
          </div>
          <div className="stat-box clickable" onClick={() => navigate('/all-colleges?tier=Tier 3')}>
            <div className="stat-number">{stats.total_tier3 || 0}</div>
            <div className="stat-text">Tier 3 Colleges</div>
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section id="colleges" className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Colleges</h2>
          <p className="section-subtitle">Explore some of the most sought-after institutions in the country.</p>
        </div>

        <div className="colleges-grid">
          {colleges.slice(0, 6).map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>

        <div className="view-all-container" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <button className="view-all-btn" onClick={() => navigate('/all-colleges')} style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
            View All Colleges ⟶
          </button>
        </div>
      </section>

      {/* Compare Section */}
      <section id="compare" className="compare-section">
        <div className="section-header">
          <h2 className="section-title" style={{ fontSize: "50px", marginBottom: "10px" }}>College Comparison Tool</h2>
          <p className="section-subtitle">Stuck between two options? Compare them side-by-side to make the right choice.</p>
        </div>

        <div className="compare-container">
          <Select
            options={collegeOptions}
            onChange={(opt) => setSelectedCol1(opt ? opt.value : "")}
            placeholder="Search College 1 (Name, City, State)"
            isClearable
            filterOption={customFilter}
            styles={selectStyles}
            className="searchable-select"
          />
          <div className="vs-badge">𝒱𝒮</div>

          <Select
            options={collegeOptions}
            onChange={(opt) => setSelectedCol2(opt ? opt.value : "")}
            placeholder="Search College 2 (Name, City, State)"
            isClearable
            filterOption={customFilter}
            styles={selectStyles}
            className="searchable-select"
          />
          <button className="compare-btn" onClick={handleCompare} style={{ color: "black" }}>Compare Now</button>
        </div>

        {compareData.col1 && compareData.col2 && (
          <div className="compare-results">
            <table className="compare-table">
              <thead><tr><th>Feature</th><th>{compareData.col1.College_Name}</th><th>{compareData.col2.College_Name}</th></tr></thead>
              <tbody>
                <tr><td>Rating</td><td>{compareData.col1.User_Rating} / 5</td><td>{compareData.col2.User_Rating} / 5</td></tr>
                <tr><td>Tier</td><td>{compareData.col1.Tier}</td><td>{compareData.col2.Tier}</td></tr>
                <tr><td>UG Fees</td><td>{formatValue(compareData.col1.UG_fee, 'fee')}</td><td>{formatValue(compareData.col2.UG_fee, 'fee')}</td></tr>
                <tr><td>UG Course</td><td>{compareData.col1.UG_Course || "Info Unavailable"}</td><td>{compareData.col2.UG_Course || "Info Unavailable"}</td></tr>
                <tr><td>Avg Package</td><td style={{ color: "lightskyblue", fontWeight: '600' }}>{formatValue(compareData.col1.Avg_package, 'package')}</td><td style={{ color: "lightskyblue", fontWeight: '600' }}>{formatValue(compareData.col2.Avg_package, 'package')}</td></tr>
                <tr><td>Highest Package</td><td style={{ color: "#10B981", fontWeight: '600' }}>{formatValue(compareData.col1.Highest_package, 'package')}</td><td style={{ color: "#10B981", fontWeight: '600' }}>{formatValue(compareData.col2.Highest_package, 'package')}</td></tr>
                <tr><td style={{ fontWeight: 'bold' }}>Reality Score</td><td style={{ color: "gold" }}><Star size={14} fill="gold" strokeWidth={1} style={{ verticalAlign: 'middle' }} /> {compareData.col1.Reality_score}/10</td><td style={{ color: "gold" }}><Star size={14} fill="gold" strokeWidth={1} style={{ verticalAlign: 'middle' }} /> {compareData.col2.Reality_score}/10</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Footer / About Section */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>UCIMS Mission</h3>
            <p className="footer-desc">
              UCIMS helps students compare colleges using real dataset values like fees, placements, rankings, tier, and facilities.
            </p>
          </div>
          <div className="footer-col">
            <h3>Contact Details</h3>
            <div className="contact-info">
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Agra Road, Jaipur, Rajasthan, 302031, India</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} /> +91 8400571641 , +91 9838916506</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> gaurshivam775@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UCIMS. All rights reserved.</p>
        </div>

      </footer>
    </div>
  );
}