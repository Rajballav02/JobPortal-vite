import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";
import { timeAgo } from "../utils/format";

export default function JobCard({ job }) {
  const { user } = useAuth();
  const { isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const saved = user ? isJobSaved(job.id) : false;
  const applied = user ? hasApplied(job.id) : false;

  function handleSave(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      showToast("Please login to save jobs.", "info");
      navigate("/login");
      return;
    }
    const result = toggleSaveJob(job.id);
    if (result.success) showToast(result.saved ? "Job saved to your list." : "Job removed from saved list.", "success");
  }

  return (
    <article className="job-card-large card border-0 h-100">
      <div className="card-body d-flex flex-column">
        <div className="job-card-topline">
          <span className="job-category-pill"><i className="bi bi-sparkles"></i>{job.category}</span>
          <span className="job-fresh-pill"><i className="bi bi-clock-history"></i>New opportunity</span>
        </div>
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div className="job-logo job-logo-featured">{job.logo}</div>
            <div className="min-w-0">
              <h3 className="job-card-title mb-1">{job.title}</h3>
              <p className="job-company mb-0">{job.company}</p>
            </div>
          </div>
          <button className={`btn save-btn ${saved ? "saved" : ""}`} onClick={handleSave} title={saved ? "Unsave job" : "Save job"}>
            <i className={`bi ${saved ? "bi-bookmark-heart-fill" : "bi-bookmark"}`}></i>
          </button>
        </div>

        <div className="job-meta mb-3">
          <span className="chip"><i className="bi bi-geo-alt"></i>{job.location}</span>
          <span className="chip"><i className="bi bi-briefcase"></i>{job.type}</span>
          <span className="chip"><i className="bi bi-bar-chart-steps"></i>{job.level}</span>
        </div>

        <p className="job-card-description job-desc-clamp mb-3">{job.description}</p>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {job.skills.slice(0, 4).map((skill) => <span key={skill} className="badge skill-badge">{skill}</span>)}
        </div>

        <div className="job-card-footer mt-auto">
          <div>
            <p className="job-salary mb-1">₹{job.salaryMin}L – ₹{job.salaryMax}L</p>
            <p className="job-posted mb-0">Posted {timeAgo(job.postedDate)}</p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            {applied && <span className="badge bg-success-subtle text-success">Applied</span>}
            <Link to={`/jobs/${job.id}`} className="btn btn-primary job-view-btn">View job <i className="bi bi-arrow-up-right ms-1"></i></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
