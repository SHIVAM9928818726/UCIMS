import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { imageMapping, genericGalleryFallback } from "./imageMapping";
import "./CollegeDetails.css";

export default function CollegeDetails() {
  const { collegeName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Load from state if navigated from card, otherwise we'd normally fetch from API directly
  const [college, setCollege] = useState(location.state?.college || null);
  const [images, setImages] = useState(genericGalleryFallback);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If user arrived directly via URL without state, fetch data
    if (!college && collegeName) {
      const fetchDirect = async () => {
        try {
          const res = await fetch(`/api/colleges?search=${encodeURIComponent(collegeName)}`);
          const data = await res.json();
          if (data && data.length > 0) {
            setCollege(data[0]); // Pick first match
          }
        } catch (e) { console.error("Failed fetching college details."); }
      };
      fetchDirect();
    }
  }, [collegeName, college]);

  useEffect(() => {
    if (college && college.College_Name) {
      if (imageMapping[college.College_Name]) {
        setImages(imageMapping[college.College_Name]);
      } else {
        setImages(genericGalleryFallback);
      }
    }
  }, [college]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!college) {
    return <div className="loading-state"><h2>Loading College Details...</h2></div>;
  }

  // Value formatting
  const formatData = (val) => {
    if (!val || String(val).toLowerCase() === 'nan' || String(val).toLowerCase() === 'null') return 'Info Unavailable';
    const strVal = String(val).trim();
    if (strVal.startsWith('₹') || strVal.toLowerCase().includes('lpa')) return strVal;
    if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(strVal) || /^\d+$/.test(strVal)) return `₹${strVal}`;
    return strVal;
  };

  // Mock Generation based on Name
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };
  const nameHash = hashString(college.College_Name || "Default");
  const mockNaac = ["A++", "A+", "A", "B++", "B+"][nameHash % 5];
  const mockNirf = (nameHash % 150) + 1;
  const mockApprovals = ["AICTE, UGC, NBA", "UGC, NBA", "AICTE, DTE", "AICTE, NBA", "UGC Recognized"][nameHash % 5];
  const mockAffiliation = college.College_Type === 'Government' ? "Autonomous Institution" : "State Technical University";
  const mockCampusSize = ((nameHash % 400) + 50) + " Acres";
  const mockHostel = (nameHash % 3) === 0 ? "Boys & Girls Hostel Available (In-Campus)" : "Hostel Facilities Available";
  const mockSeats = ((nameHash % 500) + 120) * 10;
  const topRecruiters = ["Microsoft, Google, Amazon, Atlassian", "TCS, Infosys, Wipro, Capgemini", "Cognizant, IBM, Accenture, Tech Mahindra", "Deloitte, PwC, KPMG, EY", "L&T, Tata Motors, Reliance, Mahindra"][nameHash % 5];
  const mockLibrary = (nameHash % 2) === 0 ? "Central Digital Library (2 Lakh+ Books)" : "Extensive Library & E-Journals";
  const mockWifi = "High-speed Wi-Fi across campus (1Gbps)";
  const cutoffNote = (nameHash % 2) === 0 ? "JEE Main: 95+ Percentile | State CET: Under 5000 Rank" : "Merit list based on entrance test scores & 12th board marks";

  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const handleRate = async (ratingValue) => {
    if (isSubmittingRating) return;
    setIsSubmittingRating(true);
    try {
      const res = await fetch(`/api/college/${college.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: ratingValue }),
      });
      const data = await res.json();
      if (data.success) {
        setCollege((prev) => ({ ...prev, User_Rating: ratingValue }));
        alert("Thank you for your rating!");
      }
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Rating Stars Builder
  const renderStars = (rating) => {
    const rawNum = parseFloat(rating);
    const starCount = isNaN(rawNum) ? 0 : Math.round(rawNum);
    let stars = [];
    for(let i=1; i<=5; i++) {
        stars.push(
          <span 
            key={i} 
            className={i <= starCount ? "star filled" : "star"}
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onClick={() => handleRate(i)}
            title={`Rate ${i} stars`}
          >★</span>
        );
    }
    return stars;
  };
  

  

  return (
    <div className="page-container college-profile-page">
      {/* Floating Home Button */}
      <button className="fab-home" onClick={() => navigate('/home')}>
        🏠 Back to Home
      </button>

      {/* Hero Image Gallery */}
      <section className="profile-gallery" style={{ backgroundImage: `url('${images[currentImageIndex]}')` }}>
        <div className="gallery-overlay"></div>
        {images.length > 1 && (
          <>
            <button className="gallery-nav-btn prev-btn" onClick={prevImage}>❮</button>
            <button className="gallery-nav-btn next-btn" onClick={nextImage}>❯</button>
          </>
        )}
        <div className="gallery-indicators">
          {images.map((_, idx) => (
            <span key={idx} className={`indicator ${idx === currentImageIndex ? 'active' : ''}`} />
          ))}
        </div>
      </section>

      {/* Main Container */}
      <div className="profile-container">
        
        {/* Header / Overview */}
        <section className="profile-header-section glass-panel">
          <div className="header-badges">
            <span className="badge tier-badge">{college.Tier} Collage</span>
            {college.College_Type && <span className="badge type-badge">{college.College_Type}</span>}
          </div>
          <h1>{college.College_Name}</h1>
          <p className="location-text">📍 {college.City}, {college.State}, India</p>

          <div className="header-ratings">
            <div className="rating-block">
              <span className="rating-label">User Rating</span>
              <div className="stars-ui">{renderStars(college.User_Rating)}</div>
              <span className="rating-number">{college.User_Rating || 'N/A'}/5</span>
            </div>
            <div className="rating-block highlight-rating">
              <span className="rating-label"> Reality Score</span>
              <span className="rating-number">⭐ {college.Reality_score} / 10</span>
            </div>
          </div>
        </section>

        {/* Content Modules Grid */}
        <div className="modules-layout">
          
          <div className="main-column">
            {/* Fees & Courses */}
            <section className="profile-module shadow-card primary-border">
              <h2 className="module-title">💰 Fees & Courses</h2>
              <div className="financial-grid">
                <div className="fin-box fin-ug">
                  <span className="fin-label">UG Fees</span>
                  <span className="fin-value">{formatData(college.UG_fee)}</span>
                  <span className="fin-sub">per annum</span>
                </div>
                <div className="fin-box fin-pg">
                  <span className="fin-label">PG Fees</span>
                  <span className="fin-value">{formatData(college.PG_fee)}</span>
                  <span className="fin-sub">per annum</span>
                </div>
              </div>
              <div className="course-list">
                <p><strong>UG Courses:</strong> {college.UG_Course}</p>
                <p><strong>PG Courses:</strong> {college.PG_Course}</p>
              </div>
            </section>

            {/* Placements */}
            <section className="profile-module shadow-card green-border">
              <h2 className="module-title">📈 Placements</h2>
              <div className="financial-grid">
                <div className="fin-box fin-avg">
                  <span className="fin-label">Average Package</span>
                  <span className="fin-value">{formatData(college.Avg_package)}</span>
                </div>
                <div className="fin-box fin-high">
                  <span className="fin-label">Highest Package</span>
                  <span className="fin-value">{formatData(college.Highest_package)}</span>
                </div>
              </div>
              <div className="placement-highlights">
                <h3>Top Recruiters</h3>
                <p>{topRecruiters}</p>
              </div>
            </section>
            
            {/* Admission Process / Cutoff */}
            <section className="profile-module shadow-card">
              <h2 className="module-title">📝 Admission Overview</h2>
              <p className="admission-text"><strong>General Eligibility & Cutoff:</strong> {cutoffNote}</p>
              <p className="admission-text"><strong>Total Intake:</strong> ~{mockSeats} Seats Approved</p>
            </section>
          </div>

          <div className="sidebar-column">
            {/* Ranking & Accreditation */}
            <section className="profile-module shadow-card side-module">
              <h2 className="module-title">🏆 Accreditation & Ranking</h2>
              <ul className="info-list">
                <li><strong>NIRF Rank:</strong> <span>#{mockNirf}</span></li>
                <li><strong>NAAC Grade:</strong> <span className="highlight-tag naac">{mockNaac}</span></li>
                <li><strong>Approved By:</strong> <span>{mockApprovals}</span></li>
                <li><strong>Affiliated to:</strong> <span>{mockAffiliation}</span></li>
              </ul>
            </section>

            {/* Facilities */}
            <section className="profile-module shadow-card side-module">
              <h2 className="module-title">🏢 Facilities & Campus</h2>
              <ul className="info-list">
                <li><strong>Campus Size:</strong> <span>{mockCampusSize}</span></li>
                <li><strong>Hostel:</strong> <span>{mockHostel}</span></li>
                <li><strong>Library:</strong> <span>{mockLibrary}</span></li>
                <li><strong>Connectivity:</strong> <span>{mockWifi}</span></li>
              </ul>
            </section>

            {/* Contact Info */}
            <section className="profile-module shadow-card side-module dark-panel">
              <h2 className="module-title text-white">📞 Contact Info</h2>
              <div className="contact-details">
                <p><strong>Official Website:</strong> <a href={`https://www.google.com/search?q=${encodeURIComponent(college.College_Name + " official website")}`} target="_blank" rel="noreferrer" className="website-link">Search Official Website ↗</a></p>
                <p><strong>Address:</strong> {college.City}, {college.State}, India</p>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
