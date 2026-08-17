import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";
import { formatDate, timeAgo } from "../utils/format";
import JobCard from "../components/JobCard";

export default function JobDetails() {
  const { id } = useParams();
  const { jobs, isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle display-1 text-muted"></i>
        <h4 className="mt-3">Job not found</h4>
        <Link to="/jobs" className="btn btn-primary rounded-pill mt-3">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const saved = user ? isJobSaved(job.id) : false;
  const applied = user ? hasApplied(job.id) : false;
  const similarJobs = jobs.filter((j) => j.id !== job.id && j.category === job.category).slice(0, 3);

  function handleSave() {
    if (!user) {
      showToast("Please login to save jobs.", "info");
      navigate("/login");
      return;
    }
    const res = toggleSaveJob(job.id);
    if (res.success) showToast(res.saved ? "Job saved!" : "Removed from saved jobs.", "success");
  }

  function handleApplyClick() {
    if (!user) {
      showToast("Please login to apply for this job.", "info");
      navigate("/login", { state: { from: { pathname: `/apply/${job.id}` } } });
      return;
    }
    navigate(`/apply/${job.id}`);
  }

  return (
    <div className="container py-4 py-md-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/jobs">Jobs</Link>
          </li>
          <li className="breadcrumb-item active text-truncate">{job.title}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4 job-detail-header">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                <div className="job-logo job-logo-lg">{job.logo}</div>
                <div className="flex-grow-1">
                  <h3 className="fw-bold mb-1">{job.title}</h3>
                  <div className="text-muted">
                    {job.company} &bull; {job.location}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 my-3">
                <span className="chip">
                  <i className="bi bi-briefcase me-1"></i>
                  {job.type}
                </span>
                <span className="chip">
                  <i className="bi bi-bar-chart-steps me-1"></i>
                  {job.level}
                </span>
                <span className="chip">
                  <i className="bi bi-tag me-1"></i>
                  {job.category}
                </span>
                <span className="chip">
                  <i className="bi bi-people me-1"></i>
                  {job.openings} openings
                </span>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pt-2 border-top">
                <div>
                  <div className="fs-4 fw-bold text-primary">
                    ₹{job.salaryMin}L - ₹{job.salaryMax}L <span className="fs-6 text-muted fw-normal">/year</span>
                  </div>
                  <div className="text-muted small">
                    Posted {timeAgo(job.postedDate)} ({formatDate(job.postedDate)})
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className={`btn save-btn-lg ${saved ? "saved" : ""}`} onClick={handleSave}>
                    <i className={`bi ${saved ? "bi-bookmark-heart-fill" : "bi-bookmark"} me-1`}></i>
                    {saved ? "Saved" : "Save"}
                  </button>
                  {applied ? (
                    <button className="btn btn-success rounded-pill px-4" disabled>
                      <i className="bi bi-check-circle me-1"></i>Applied
                    </button>
                  ) : (
                    <button className="btn btn-primary rounded-pill px-4" onClick={handleApplyClick}>
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Job Description</h5>
              <p className="text-muted">{job.description}</p>

              <h6 className="fw-bold mt-4 mb-2">Key Responsibilities</h6>
              <ul className="text-muted">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="mb-1">
                    {r}
                  </li>
                ))}
              </ul>

              <h6 className="fw-bold mt-4 mb-2">Requirements</h6>
              <ul className="text-muted">
                {job.requirements.map((r, i) => (
                  <li key={i} className="mb-1">
                    {r}
                  </li>
                ))}
              </ul>

              <h6 className="fw-bold mt-4 mb-2">Benefits</h6>
              <div className="d-flex flex-wrap gap-2">
                {job.benefits.map((b) => (
                  <span key={b} className="badge benefit-badge">
                    <i className="bi bi-check2-circle me-1"></i>
                    {b}
                  </span>
                ))}
              </div>

              <h6 className="fw-bold mt-4 mb-2">Skills Required</h6>
              <div className="d-flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span key={s} className="badge skill-badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">About {job.company}</h6>
              <p className="text-muted small mb-2">
                {job.company} is a growing organization in the {job.category} space, dedicated to building
                impactful products and empowering its people.
              </p>
              <div className="d-flex justify-content-between small text-muted border-top pt-2 mt-2">
                <span>Industry</span>
                <span className="fw-semibold text-dark">{job.category}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted border-top pt-2 mt-2">
                <span>Company size</span>
                <span className="fw-semibold text-dark">200-500 employees</span>
              </div>
              <div className="d-flex justify-content-between small text-muted border-top pt-2 mt-2">
                <span>Headquarters</span>
                <span className="fw-semibold text-dark">{job.location}</span>
              </div>
            </div>
          </div>

          {!applied && (
            <div className="card border-0 shadow-sm apply-cta-card mb-4">
              <div className="card-body p-4 text-center">
                <i className="bi bi-send-check fs-1 mb-2"></i>
                <h6 className="fw-bold">Ready to apply?</h6>
                <p className="small mb-3 text-white-50">It only takes a couple of minutes.</p>
                <button className="btn btn-light w-100 rounded-pill fw-semibold" onClick={handleApplyClick}>
                  Apply for this Job
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {similarJobs.length > 0 && (
        <div className="mt-4">
          <h5 className="fw-bold mb-3">Similar Jobs</h5>
          <div className="row g-4">
            {similarJobs.map((j) => (
              <div className="col-md-6 col-lg-4" key={j.id}>
                <JobCard job={j} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
