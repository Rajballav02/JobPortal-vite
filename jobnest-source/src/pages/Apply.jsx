import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail, isValidPhone } from "../utils/format";

export default function Apply() {
  const { id } = useParams();
  const { jobs, applyToJob, hasApplied } = useJobs();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const job = jobs.find((j) => j.id === Number(id));

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    experience: user?.experience || "",
    coverLetter: "",
    resumeName: "",
    linkedIn: "",
    noticePeriod: "Immediate",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset the form whenever the job or the logged-in user changes, so a
  // half-filled draft never leaks into a different job's application or a
  // different account after logging out and back in.
  useEffect(() => {
    setForm({
      fullName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      experience: user?.experience || "",
      coverLetter: "",
      resumeName: "",
      linkedIn: "",
      noticePeriod: "Immediate",
    });
    setErrors({});
    setSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.email]);

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h4>Job not found</h4>
        <Link to="/jobs" className="btn btn-primary rounded-pill mt-3">
          Back to Jobs
        </Link>
      </div>
    );
  }

  if (hasApplied(job.id) && !submitted) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-check-circle-fill display-1 text-success"></i>
        <h4 className="mt-3">You've already applied to this job</h4>
        <p className="text-muted">Check your applied jobs to track the status.</p>
        <div className="d-flex gap-2 justify-content-center mt-3">
          <Link to="/applied-jobs" className="btn btn-primary rounded-pill">
            View Applied Jobs
          </Link>
          <Link to={`/jobs/${job.id}`} className="btn btn-outline-secondary rounded-pill">
            Back to Job
          </Link>
        </div>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number.";
    if (!form.experience.trim()) e.experience = "Please specify your experience.";
    if (!form.resumeName.trim()) e.resumeName = "Please attach your resume.";
    if (!form.coverLetter.trim()) e.coverLetter = "A short cover letter is required.";
    else if (form.coverLetter.trim().length < 30) e.coverLetter = "Cover letter should be at least 30 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      if (!/\.(pdf|doc|docx)$/i.test(file.name)) {
        setErrors({ ...errors, resumeName: "Only PDF, DOC or DOCX files are supported." });
        return;
      }
      setForm({ ...form, resumeName: file.name });
      setErrors({ ...errors, resumeName: undefined });
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) {
      showToast("Please fix the errors in the form.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const res = applyToJob(job.id, form);
      setSubmitting(false);
      if (res.success) {
        setSubmitted(true);
        showToast("Application submitted successfully!", "success");
      } else {
        showToast(res.message, "error");
      }
    }, 800);
  }

  if (submitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center fade-in-up">
            <div className="success-check mx-auto mb-3">
              <i className="bi bi-check-lg"></i>
            </div>
            <h3 className="fw-bold">Application Submitted!</h3>
            <p className="text-muted">
              Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been sent
              successfully. You can track its status in your Applied Jobs page.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to="/applied-jobs" className="btn btn-primary rounded-pill px-4">
                View Applied Jobs
              </Link>
              <Link to="/jobs" className="btn btn-outline-secondary rounded-pill px-4">
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-4">
            <Link to={`/jobs/${job.id}`} className="text-decoration-none small">
              <i className="bi bi-arrow-left me-1"></i>Back to job details
            </Link>
            <h3 className="fw-bold mt-2">Apply for {job.title}</h3>
            <p className="text-muted">
              at {job.company} &bull; {job.location}
            </p>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Total Experience</label>
                    <select
                      className={`form-select ${errors.experience ? "is-invalid" : ""}`}
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    >
                      <option value="">Select experience</option>
                      <option>Fresher</option>
                      <option>1-2 years</option>
                      <option>2-4 years</option>
                      <option>4-6 years</option>
                      <option>6+ years</option>
                    </select>
                    {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">LinkedIn Profile (optional)</label>
                    <input
                      className="form-control"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedIn}
                      onChange={(e) => setForm({ ...form, linkedIn: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Notice Period</label>
                    <select
                      className="form-select"
                      value={form.noticePeriod}
                      onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
                    >
                      <option>Immediate</option>
                      <option>15 days</option>
                      <option>30 days</option>
                      <option>60 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Resume / CV</label>
                  <div className={`file-upload-box ${errors.resumeName ? "border-danger" : ""}`}>
                    <input type="file" id="resume" className="d-none" accept=".pdf,.doc,.docx" onChange={handleFile} />
                    <label htmlFor="resume" className="d-flex align-items-center gap-2 mb-0 w-100" style={{ cursor: "pointer" }}>
                      <i className="bi bi-cloud-arrow-up fs-4 text-primary"></i>
                      <span className="text-muted small">
                        {form.resumeName ? (
                          <span className="text-dark fw-semibold">{form.resumeName}</span>
                        ) : (
                          "Click to upload your resume (PDF, DOC, DOCX)"
                        )}
                      </span>
                    </label>
                  </div>
                  {errors.resumeName && <div className="text-danger small mt-1">{errors.resumeName}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label">Cover Letter</label>
                  <textarea
                    className={`form-control ${errors.coverLetter ? "is-invalid" : ""}`}
                    rows="5"
                    placeholder="Tell the employer why you're a great fit for this role..."
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                  ></textarea>
                  <div className="d-flex justify-content-between">
                    {errors.coverLetter && <div className="invalid-feedback d-block">{errors.coverLetter}</div>}
                    <small className="text-muted ms-auto">{form.coverLetter.length} characters</small>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
