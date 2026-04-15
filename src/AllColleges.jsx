import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CollegeCard from "./CollegeCard";
import "./AllColleges.css";

export default function AllColleges() {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to parse URL params initially
  const getInitialFilters = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get("search") || "",
      tier: params.get("tier") || "",
      college_type: params.get("college_type") || "",
      sort: params.get("sort") || "",
    };
  };

  // State for the actual filters used in API fetching
  const [filters, setFilters] = useState(getInitialFilters());
  // Local state for the search input box text (doesn't trigger filter immediately)
  const [searchInput, setSearchInput] = useState(filters.search);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  // Sync filters with URL if navigation happens
  useEffect(() => {
    const init = getInitialFilters();
    setFilters(init);
    setSearchInput(init.search);
  }, [location.search]);

  // Fetch colleges whenever filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchColleges();
  }, [filters]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });
      const res = await fetch(`/api/colleges?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setColleges(data);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Triggered when Search button clicked or Enter pressed
  const handleSearchTrigger = (e) => {
    if (e) e.preventDefault();

    // Requirement: Show warning if search is empty AND no dropdowns selected
    const isAllFiltersEmpty = 
        !searchInput.trim() && 
        !filters.tier && 
        !filters.college_type && 
        !filters.sort;

    if (isAllFiltersEmpty) {
      setShowWarning(true);
      return;
    }

    setShowWarning(false);
    // Update the filters state, which triggers useEffect -> fetchColleges
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  // Triggered when dropdowns change (immediate update)
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setShowWarning(false);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="page-container all-colleges-page">
      {/* Floating Action Button */}
      <button className="fab-home" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      {/* Header Section */}
      <header className="listing-header">
        <h1>Explore Colleges</h1>
        <p>Find the best institutions based on your preferences</p>
      </header>

      {/* Hero Search Section */}
      <section className="search-hero">
        <div className="search-container">
          <form className="search-input-group" onSubmit={handleSearchTrigger}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Search by college name, city or state..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="main-search-input"
              />
              <button type="submit" className="search-btn">
                🔍 Search
              </button>
            </div>
            
            {showWarning && (
              <div className="warning-message">
                <span>🚨 Warning: Please select or enter search criteria properly.</span>
              </div>
            )}
          </form>

          {/* Quick Filters Row */}
          <div className="filters-row">
            <div className="filter-item">
              <label>📍 Tier</label>
              <select name="tier" value={filters.tier} onChange={handleDropdownChange}>
                <option value="">All Tiers</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
            </div>

            <div className="filter-item">
              <label>🏛️ College Type</label>
              <select name="college_type" value={filters.college_type} onChange={handleDropdownChange}>
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div className="filter-item">
              <label>📊 Fees Sorting</label>
              <select name="sort" value={filters.sort} onChange={handleDropdownChange}>
                <option value="">Sort By...</option>
                <option value="ug_fee">Fees (Low to High)</option>
                <option value="reality_score">Reality Score</option>
                <option value="avg_package">Avg Package</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="results-container">
        <div className="results-meta">
          {loading ? (
            <p className="loading-text">Fetching results...</p>
          ) : (
            <p className="count-text">Found {colleges.length} colleges</p>
          )}
        </div>

        <div className="colleges-grid">
          {!loading && colleges.length > 0 ? (
            colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))
          ) : (
            !loading && <div className="no-results">No colleges found matching your criteria.</div>
          )}
        </div>
      </main>
    </div>
  );
}
