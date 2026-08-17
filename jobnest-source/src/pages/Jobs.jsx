import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";
import JobCard from "../components/JobCard";
import { CATEGORIES, JOB_TYPES, JOB_LEVELS, LOCATIONS } from "../data/jobs";
import Loader from "../components/Loader";

const PAGE_SIZE = 8;

function FiltersPanel({ category, setCategory, type, setType, level, setLevel, minSalary, setMinSalary, activeFilterCount, onClear, onApply }) {
  return (
    <div className="filters-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">
          <i className="bi bi-funnel me-2"></i>Filters
        </h6>
        {activeFilterCount > 0 && (
          <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Category</label>
        <select className="form-select form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Job Type</label>
        <select className="form-select form-select-sm" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Experience Level</label>
        <select className="form-select form-select-sm" value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          {JOB_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label small fw-semibold">
          Minimum Salary: <span className="text-primary">₹{minSalary}L</span>
        </label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="30"
          step="1"
          value={minSalary}
          onChange={(e) => setMinSalary(Number(e.target.value))}
        />
      </div>
      <button type="button" className="btn jobs-apply-filters w-100 mt-3" onClick={onApply}>
        <i className="bi bi-funnel me-2"></i>Apply Filters
      </button>

      <datalist id="locations">
        {LOCATIONS.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>
    </div>
  );
}

export default function Jobs() {
  const { jobs } = useJobs();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [keyword, location, category, type, level, minSalary, sortBy]);

  useEffect(() => {
    const params = {};
    if (keyword) params.q = keyword;
    if (location) params.location = location;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, location, category]);

  const filtered = useMemo(() => {
    let result = jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(keyword.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase()));
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = !category || job.category === category;
      const matchesType = !type || job.type === type;
      const matchesLevel = !level || job.level === level;
      const matchesSalary = job.salaryMax >= minSalary;
      return matchesKeyword && matchesLocation && matchesCategory && matchesType && matchesLevel && matchesSalary;
    });

    switch (sortBy) {
      case "salary-high":
        result = [...result].sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case "salary-low":
        result = [...result].sort((a, b) => a.salaryMax - b.salaryMax);
        break;
      case "az":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
      default:
        result = [...result].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }
    return result;
  }, [jobs, keyword, location, category, type, level, minSalary, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function clearFilters() {
    setKeyword("");
    setLocation("");
    setCategory("");
    setType("");
    setLevel("");
    setMinSalary(0);
    setSortBy("recent");
    showToast("Filters cleared.", "info");
  }

  function applyFilters() {
    setFiltersOpen(false);
    showToast(`Filters applied — ${filtered.length} job${filtered.length === 1 ? "" : "s"} found.`, "success");
  }

  const activeFilterCount = [category, type, level].filter(Boolean).length + (minSalary > 0 ? 1 : 0);

  const filtersProps = {
    category, setCategory, type, setType, level, setLevel, minSalary, setMinSalary,
    activeFilterCount, onClear: clearFilters, onApply: applyFilters,
  };

  return (
    <main className="jobs-page">
      <section className="jobs-search-hero">
      <div className="jobs-page-heading">
        <div>
          <span className="jobs-eyebrow"><i className="bi bi-stars me-2"></i>Curated opportunities</span>
          <h1>Find your next great role</h1>
          <p>{filtered.length} roles matched to help you move forward.</p>
        </div>
      </div>

      <div className="search-toolbar mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Job title, company, or skill"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-8 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-geo-alt"></i>
              </span>
              <input
                type="text"
                className="form-control"
                list="locations"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="col-4 col-md-3">
            <button type="button" className="btn btn-outline-secondary w-100 d-md-none" onClick={() => setFiltersOpen(true)}>
              <i className="bi bi-sliders me-1"></i>Filters
              {activeFilterCount > 0 && <span className="badge bg-primary ms-1">{activeFilterCount}</span>}
            </button>
            <select
              className="form-select d-none d-md-block"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="az">Title: A-Z</option>
            </select>
          </div>
        </div>
        <div className="d-md-none mt-2">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="salary-high">Salary: High to Low</option>
            <option value="salary-low">Salary: Low to High</option>
            <option value="az">Title: A-Z</option>
          </select>
        </div>
      </div>

      </section>

      <div className="row g-4">
        <aside className="col-lg-3 d-none d-lg-block">
          <FiltersPanel {...filtersProps} />
        </aside>

        <section className="col-lg-9">
          {loading ? (
            <Loader />
          ) : paginated.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-emoji-frown display-1 text-muted"></i>
              <h5 className="mt-3">No jobs match your search</h5>
              <p className="text-muted">Try adjusting your filters or search keywords</p>
              <button type="button" className="btn btn-primary rounded-pill" onClick={clearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="row job-results-grid g-4">
                {paginated.map((job) => (
                  <div className="col-12 col-md-6 col-xl-3" key={job.id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-4 d-flex justify-content-center">
                  <ul className="pagination">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button type="button" className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                        <button type="button" className="page-link" onClick={() => setPage(p)}>
                          {p}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button type="button" className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </section>
      </div>

      {/* Mobile filters offcanvas */}
      <div className={`custom-offcanvas-backdrop ${filtersOpen ? "show" : ""}`} onClick={() => setFiltersOpen(false)}></div>
      <div className={`custom-offcanvas custom-offcanvas-end ${filtersOpen ? "show" : ""}`}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h6 className="fw-bold mb-0">Filters</h6>
          <button type="button" className="btn-close" onClick={() => setFiltersOpen(false)}></button>
        </div>
        <div className="p-3 flex-grow-1 overflow-auto">
          <FiltersPanel {...filtersProps} />
        </div>
        <div className="p-3 border-top">
          <button type="button" className="btn btn-primary w-100 rounded-pill" onClick={() => setFiltersOpen(false)}>
            Show {filtered.length} Jobs
          </button>
        </div>
      </div>
    </main>
  );
}
