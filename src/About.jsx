import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-container about-page">
      {/* Mini Navbar for About Page */}
      <nav className="navbar">
        <Link to="/home" className="logo">
         <img src="data:image/svg+xml;utf8,%3Csvg%20width%3D%2245%22%20height%3D%2245%22%20viewBox%3D%220%200%2064%2064%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3C!--%20Outer%20Circle%20--%3E%0A%20%20%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2230%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%224%22%20fill%3D%22%230f172a%22%3E%3C%2Fcircle%3E%0A%0A%20%20%3C!--%20Graduation%20Cap%20--%3E%0A%20%20%3Cpath%20d%3D%22M16%2024L32%2016L48%2024L32%2032L16%2024Z%22%20fill%3D%22%2338bdf8%22%3E%3C%2Fpath%3E%0A%20%20%3Cpath%20d%3D%22M22%2028V36C22%2036%2028%2040%2032%2040C36%2040%2042%2036%2042%2036V28L32%2034L22%2028Z%22%20fill%3D%22%232563eb%22%3E%3C%2Fpath%3E%0A%0A%20%20%3C!--%20Data%20Bars%20--%3E%0A%20%20%3Crect%20x%3D%2220%22%20y%3D%2244%22%20width%3D%226%22%20height%3D%2210%22%20fill%3D%22%2338bdf8%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%20%20%3Crect%20x%3D%2229%22%20y%3D%2240%22%20width%3D%226%22%20height%3D%2214%22%20fill%3D%22%232563eb%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%20%20%3Crect%20x%3D%2238%22%20y%3D%2246%22%20width%3D%226%22%20height%3D%228%22%20fill%3D%22%2338bdf8%22%20rx%3D%222%22%3E%3C%2Frect%3E%0A%3C%2Fsvg%3E" alt="ucims logo"></img> <span>About</span>
                 </Link>
        <ul className="nav-links">
          <li><Link to="/home">🏠 Home</Link></li>
          <li><Link to="/home#colleges">🏫 Colleges</Link></li>
        </ul>
        <Link to="/home" className="admin-login-btn">Back to Home</Link>
      </nav>

      <main className="about-container">
        <header className="about-header">
          <h1>About UCIMS</h1>
          <p className="subtitle">Unified College Information and Management System</p>
        </header>

        <section className="about-section highlight">
          <h2>1. Introduction</h2>
          <p>
            The <strong>Unified College Information and Management System (UCIMS)</strong> is a cutting-edge platform designed to revolutionize how students explore and interact with higher education institutions. UCIMS serves as a comprehensive, centralized hub that brings together a vast database of colleges, courses, and placement data into a single, intuitive interface.
          </p>
        </section>

        <section className="about-section">
          <h2>2. Problem Statement</h2>
          <p>
            Today's students face immense challenges when it comes to choosing the right college. The digital landscape is cluttered with scattered information, unreliable data, and biased reviews. Searching for specific details—like actual placement packages, fee structures across states, or comparing two institutions side-by-side—often leads to confusion and suboptimal decisions that can impact a student's entire career.
          </p>
        </section>

        <section className="about-section solution">
          <h2>3. Solution Provided by UCIMS</h2>
          <p>
            UCIMS solves this data-fragmentation problem by acting as a <strong>one-stop resource</strong>. We gather, verify, and organize complex institutional data into a structured format. By providing transparent metrics and advanced filtering tools, we empower students to transition from "searching" to "deciding" with total confidence.
          </p>
        </section>

        <section className="about-section">
          <h2>4. Key Features</h2>
          <ul className="features-list">
            <li><strong>Search:</strong> Quickly find any college by its name, city, or state.</li>
            <li><strong>Tier Filtering:</strong> Filter institutions by their industry standing (Top, Average, or Low).</li>
            <li><strong>Academic Filters:</strong> Narrow down choices based on specific UG and PG courses.</li>
            <li><strong>Financial Insights:</strong> Instant visibility into fee structures and average placement packages.</li>
            <li><strong>Side-by-Side Comparison:</strong> Compare two colleges directly to see where they differ in metrics.</li>
            <li><strong>Full Detail Cards:</strong> View expanded profiles including highest packages and detailed course offerings.</li>
            <li><strong>Reality Score System:</strong> Use our proprietary metric to judge the real value of an institution.</li>
          </ul>
        </section>

        <section className="about-section score-highlight">
          <h2>5. The Reality Score Explanation</h2>
          <p>
            A unique innovation of the UCIMS platform is the <strong>Reality Score (1–10)</strong>. Unlike traditional rankings that rely on heritage or marketing, the Reality Score is a data-driven metric calculated using:
          </p>
          <div className="score-metrics">
            <span>Verified Placements</span>
            <span>Fee-to-Package Ratio</span>
            <span>Real User Ratings</span>
            <span>Salary Transparency</span>
          </div>
          <p>This score provides a realistic view of the return on investment (ROI) a student can expect from a specific college.</p>
        </section>

        <section className="about-section">
          <h2>6. Target Users</h2>
          <div className="users-grid">
            <div className="user-card">
              <h3>Students</h3>
              <p>Direct users searching for the best academic fit for their future.</p>
            </div>
            <div className="user-card">
              <h3>Parents</h3>
              <p>Decision-makers looking for financial transparency and long-term career value.</p>
            </div>
            <div className="user-card">
              <h3>Educational Consultants</h3>
              <p>Professionals who need a fast, reliable database to guide their clients accurately.</p>
            </div>
          </div>
        </section>

        <section className="about-section future-scope">
          <h2>7. Future Scope</h2>
          <p>Our roadmap for UCIMS includes constant evolution to stay ahead of the educational curve:</p>
          <ul>
            <li><strong>Real-time API Integration:</strong> Connecting directly with university databases for instant updates.</li>
            <li><strong>Student Review System:</strong> A verified alumni testimonial portal.</li>
            <li><strong>Scholarship Updates:</strong> Real-time notifications for govt and private grants.</li>
            <li><strong>AI-Based Recommendations:</strong> An intelligent engine that suggests colleges based on your academic profile.</li>
          </ul>
        </section>

        <footer className="about-footer">
          <h2>Conclusion</h2>
          <p>
            UCIMS is more than just a search engine; it is a vital tool for the modern educational era. By bringing transparency to college data, we ensure that every student has the information they need to choose the path that is truly right for them.
          </p>
          <div className="final-note">Suitable for College Final Year Project • Version 1.0.0</div>
        </footer>
      </main>
    </div>
  );
};

export default About;
