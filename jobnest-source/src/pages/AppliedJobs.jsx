import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/format";

const STATUS_STYLES = {
  Applied: "status-applied",
  "In Review": "status-review",
  Shortlisted: "status-shortlisted",
  Rejected: "status-rejected",
  Hired: "status-hired",
  Withdrawn: "status-withdrawn",
};

export default function AppliedJobs() {
  const { applications, withdrawApplication, getEffectiveStatus, jobs } = useJobs();
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);

  const enriched = useMemo(
    () =>
      applications.map((a) => ({
        ...a,
        effectiveStatus: getEffectiveStatus(a),
        job: jobs.find((j) => j.id === a.jobId),
      })),
    [applications, getEffectiveStatus, jobs]
  );

  const filtered =
    statusFilter === "All" ? enriched : enriched.filter((a) => a.effectiveStatus === statusFilter);

  function handleWithdraw(id) {
    withdrawApplication(id);
    showToast("Application withdrawn successfully.", "warning");
    setConfirmId(null);
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-0">Applied Jobs</h3>
          <p className="text-muted mb-0">Track the progress of your job applications</p>
        </div>
        <select className="form-select w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["All", "Applied", "In Review", "Shortlisted", "Rejected", "Hired", "Withdrawn"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-send display-1 text-muted"></i>
          <h5 className="mt-3">No applications {statusFilter !== "All" ? `with status "${statusFilter}"` : "yet"}</h5>
          <p className="text-muted">Start applying to jobs to see them here.</p>
          <Link to="/jobs" className="btn btn-primary rounded-pill">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((app) => (
            <div className="col-12" key={app.id}>
              <div className="card border-0 shadow-sm applied-job-row">
                <div className="card-body p-3 p-md-4">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-5">
                      <div className="d-flex align-items-center gap-3">
                        <div className="job-logo">{app.job?.logo || "💼"}</div>
                        <div>
                          <Link to={app.job ? `/jobs/${app.job.id}` : "#"} className="fw-bold text-decoration-none text-dark">
                            {app.jobTitle}
                          </Link>
                          <div className="text-muted small">{app.company}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="text-muted small">Applied On</div>
                      <div className="fw-semibold">{formatDate(app.appliedDate)}</div>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className={`status-badge ${STATUS_STYLES[app.effectiveStatus]}`}>
                        {app.effectiveStatus}
                      </span>
                    </div>
                    <div className="col-12 col-md-2 text-md-end">
                      {app.effectiveStatus !== "Withdrawn" && app.effectiveStatus !== "Hired" && (
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => setConfirmId(app.id)}
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {confirmId === app.id && (
                    <div className="alert alert-warning d-flex justify-content-between align-items-center mt-3 mb-0 py-2">
                      <span className="small">Are you sure you want to withdraw this application?</span>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-danger" onClick={() => handleWithdraw(app.id)}>
                          Yes, Withdraw
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setConfirmId(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
