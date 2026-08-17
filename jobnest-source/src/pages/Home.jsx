import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import JobCard from "../components/JobCard";
import { CATEGORIES } from "../data/jobs";

const STATS = [
  { label: "Active Jobs", value: "60+", icon: "bi-briefcase" },
  { label: "Companies", value: "10+", icon: "bi-building" },
  { label: "Categories", value: "8", icon: "bi-grid" },
  { label: "Candidates Hired", value: "2,300+", icon: "bi-person-check" },
];

export default function Home() {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    navigate(`/jobs?${params.toString()}`);
  }

  const featured = jobs.slice(0, 8);

  return (
    <div className="home-page">
      <section className="home-discovery-hero">
        <div className="home-discovery-copy">
          <span className="home-discovery-kicker"><i className="bi bi-stars"></i> CAREER DISCOVERY PLATFORM</span>
          <h1>Find a role that<br /><em>moves you forward.</em></h1>
          <p>Discover hand-picked opportunities from growing teams, built around the skills you already have.</p>
          <div className="home-discovery-actions">
            <button className="btn home-discovery-primary" onClick={() => navigate("/jobs")}>Explore opportunities <i className="bi bi-arrow-right"></i></button>
            <button className="btn home-discovery-secondary" onClick={() => navigate("/register")}>Create free profile</button>
          </div>
          <div className="home-discovery-stats"><span><strong>60+</strong> open roles</span><span><strong>10+</strong> trusted companies</span><span><strong>2.3k</strong> candidates hired</span></div>
        </div>
        <div className="home-discovery-visual" aria-hidden="true">
          <div className="discovery-orb"></div><div className="discovery-card discovery-card-one"><i className="bi bi-briefcase-fill"></i><span>New roles<br /><b>every day</b></span></div><div className="discovery-card discovery-card-two"><i className="bi bi-graph-up-arrow"></i><span>Grow your<br /><b>career</b></span></div><div className="discovery-ring"></div>
        </div>
      </section>

      <section className="home-search-strip">
        <div className="home-content">
          <form className="search-bar-card mx-auto" onSubmit={handleSearch}>
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5 text-start">
                <div className="input-group">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Job title, keywords, or company"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4 text-start">
                <div className="input-group">
                  <span className="input-group-text bg-white border-0">
                    <i className="bi bi-geo-alt text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3">
                <button type="submit" className="btn btn-primary w-100 rounded-pill fw-semibold">
                  Search Jobs
                </button>
              </div>
            </div>
          </form>
          <div className="mt-3 d-flex flex-wrap justify-content-center gap-2">
            <span className="home-search-popular-label small">Popular:</span>
            {["Frontend Developer", "Data Analyst", "UI/UX Designer", "Remote"].map((t) => (
              <button
                key={t}
                className="btn btn-sm popular-chip popular-chip-light"
                onClick={() => navigate(`/jobs?q=${encodeURIComponent(t)}`)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 stats-section stats-section-strip">
        <div className="home-content">
          <div className="row g-3 g-md-4">
            {STATS.map((s) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="stat-card text-center h-100">
                  <div className="stat-icon-wrap"><i className={`bi ${s.icon} stat-icon`}></i></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 category-section">
        <div className="home-content">
          <div className="section-heading text-center mb-4 mb-md-5">
            <span className="section-kicker">Find your path</span>
            <h2 className="fw-bold">Browse by Category</h2>
            <p className="text-muted mb-0">Explore roles tailored to what you do best</p>
          </div>
          <div className="row g-3">
            {CATEGORIES.map((cat, i) => (
              <div className="col-6 col-md-3" key={cat}>
                <button
                  className="category-card w-100 h-100"
                  onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat)}`)}
                >
                  <span className="category-icon-wrap"><i
                    className={`bi ${
                      ["bi-code-slash", "bi-palette", "bi-kanban", "bi-graph-up", "bi-megaphone", "bi-people"][i % 6]
                    } category-icon`}
                  ></i></span>
                  <div className="category-title">{cat}</div>
                  <div className="category-meta">
                    {jobs.filter((j) => j.category === cat).length} open positions
                  </div>
                  <i className="bi bi-arrow-up-right category-arrow"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light-section">
        <div className="home-content">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="section-kicker">Curated for you</span>
              <h2 className="fw-bold mb-0">Featured Jobs</h2>
              <p className="text-muted">Hand-picked opportunities just for you</p>
            </div>
            <button className="btn btn-outline-primary rounded-pill d-none d-md-block" onClick={() => navigate("/jobs")}>
              View All Jobs
            </button>
          </div>
          <div className="row g-4">
            {featured.map((job) => (
              <div className="col-12 col-md-6 col-xl-3" key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4 d-md-none">
            <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate("/jobs")}>
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      <section className="py-5 cta-section text-center">
        <div className="home-content">
          <h2 className="fw-bold text-white mb-2">Ready to take the next step in your career?</h2>
          <p className="text-white-50 mb-4">Create a free account and start applying to jobs today.</p>
          <button className="btn btn-light rounded-pill px-4 fw-semibold" onClick={() => navigate("/register")}>
            Get Started — It's Free
          </button>
        </div>
      </section>
    </div>
  );
}
