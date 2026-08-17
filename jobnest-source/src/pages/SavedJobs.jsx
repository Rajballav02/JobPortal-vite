import { Link } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import JobCard from "../components/JobCard";

export default function SavedJobs() {
  const { jobs, savedIds } = useJobs();
  const savedJobs = jobs.filter((j) => savedIds.includes(j.id));

  return (
    <div className="container py-4 py-md-5">
      <div className="mb-4">
        <h3 className="fw-bold mb-0">Saved Jobs</h3>
        <p className="text-muted mb-0">{savedJobs.length} jobs saved for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bookmark-heart display-1 text-muted"></i>
          <h5 className="mt-3">No saved jobs yet</h5>
          <p className="text-muted">Save jobs you're interested in to revisit them later.</p>
          <Link to="/jobs" className="btn btn-primary rounded-pill">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {savedJobs.map((job) => (
            <div className="col-md-6 col-lg-4" key={job.id}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
