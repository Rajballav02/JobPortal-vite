import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail, isValidPhone, formatDate, avatarStyle } from "../utils/format";
import { useJobs } from "../context/JobsContext";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

function ProfileOverview({ user, applications, savedIds, onEdit, onAvatarChange }) {
  const details = [
    ["bi-person", "Full Name", user.name], ["bi-envelope", "Email", user.email],
    ["bi-telephone", "Phone", user.phone || "—"], ["bi-geo-alt", "Location", user.location || "—"],
    ["bi-briefcase", "Job Title", user.title || "—"], ["bi-award", "Experience", user.experience || "—"],
  ];

  return (
    <div className="profile-overview-page">
      <section className="profile-overview-grid">
        <article className="profile-identity-panel">
          <button className="profile-overview-more" aria-label="Profile options"><i className="bi bi-three-dots-vertical"></i></button>
          <div className="profile-identity-head">
            <div className="profile-overview-avatar" style={avatarStyle(user)}>
              {!user.avatarImage && user.name.charAt(0).toUpperCase()}
              <input type="file" id="overview-avatar-input" className="d-none" accept="image/*" onChange={onAvatarChange} />
              <label htmlFor="overview-avatar-input" aria-label="Change profile photo"><i className="bi bi-camera-fill"></i></label>
            </div>
            <div><h1>{user.name} <i className="bi bi-patch-check-fill"></i></h1><p>{user.title || "Add your job title"}</p><span>{user.role}</span></div>
          </div>
          <div className="profile-overview-contact">
            <div><i className="bi bi-envelope"></i><strong>{user.email}</strong><small>Email</small></div><div><i className="bi bi-telephone"></i><strong>{user.phone || "—"}</strong><small>Phone</small></div><div><i className="bi bi-calendar3"></i><strong>{formatDate(user.createdAt)}</strong><small>Member Since</small></div><div><i className="bi bi-geo-alt"></i><strong>{user.location || "—"}</strong><small>Location</small></div>
          </div>
          <div className="profile-overview-metrics">
            <div className="applications"><span><i className="bi bi-briefcase"></i></span><strong>{applications.length}</strong><b>Applications</b><small>Jobs applied</small></div><div className="saved"><span><i className="bi bi-bookmark"></i></span><strong>{savedIds.length}</strong><b>Saved Jobs</b><small>Jobs saved</small></div>
          </div>
        </article>
        <article className="profile-information-panel">
          <header><div className="profile-information-title"><span><i className="bi bi-person-fill"></i></span><h2>Profile Details</h2></div><button onClick={onEdit}><i className="bi bi-pencil"></i> Edit Profile</button></header>
          <div className="profile-information-grid">{details.map(([icon, label, value]) => <div className="profile-information-item" key={label}><span><i className={`bi ${icon}`}></i></span><div><small>{label}</small><strong>{value}</strong></div></div>)}</div>
          <div className="profile-information-wide"><span><i className="bi bi-person"></i></span><div><small>Bio</small><strong>{user.bio || "No bio added yet."}</strong></div></div>
          <div className="profile-information-wide"><span><i className="bi bi-code-slash"></i></span><div><small>Skills</small>{user.skills?.length ? <div className="profile-overview-skills">{user.skills.map((skill) => <b key={skill}>{skill}</b>)}</div> : <strong>No skills added yet.</strong>}</div></div>
          <div className="profile-information-wide no-border"><span><i className="bi bi-file-earmark-text"></i></span><div><small>Resume</small><strong>{user.resumeName || "No resume uploaded."}</strong></div></div>
        </article>
      </section>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { applications, savedIds } = useJobs();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user, skillsInput: user.skills?.join(", ") || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Guard against stale form data ever surviving a user switch (e.g. logout
  // then a different account logging back in without a full page reload).
  useEffect(() => {
    setForm({ ...user, skillsInput: user.skills?.join(", ") || "" });
    setErrors({});
    setEditing(false);
  }, [user?.email]);

  function startEdit() {
    setForm({ ...user, skillsInput: user.skills?.join(", ") || "" });
    setErrors({});
    setEditing(true);
  }

  function readImageFile(file, cb) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.", "error");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      showToast("Image is too large. Please choose a file under 2MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  }

  function handleOverviewAvatarChange(e) {
    const file = e.target.files[0];
    readImageFile(file, (dataUrl) => {
      const res = updateProfile({ avatarImage: dataUrl });
      if (res.success) showToast("Profile photo updated.", "success");
      else showToast(res.message, "error");
    });
    e.target.value = "";
  }

  function handleEditAvatarChange(e) {
    const file = e.target.files[0];
    readImageFile(file, (dataUrl) => {
      setForm((f) => ({ ...f, avatarImage: dataUrl }));
      showToast("Photo attached. Save to confirm.", "info");
    });
    e.target.value = "";
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim() || !isValidEmail(form.email)) e.email = "Enter a valid email.";
    if (form.phone && !isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      const skills = form.skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        title: form.title,
        location: form.location,
        bio: form.bio,
        experience: form.experience,
        skills,
        resumeName: form.resumeName,
        avatarImage: form.avatarImage,
      });
      setSaving(false);
      if (res.success) {
        showToast("Profile updated successfully.", "success");
        setEditing(false);
      } else {
        showToast(res.message, "error");
      }
    }, 500);
  }

  function handleResumeUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, resumeName: file.name });
      showToast(`Resume "${file.name}" attached. Save to confirm.`, "info");
    }
  }

  if (!editing) {
    return (
      <ProfileOverview
        user={user}
        applications={applications}
        savedIds={savedIds}
        onEdit={startEdit}
        onAvatarChange={handleOverviewAvatarChange}
      />
    );
  }

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-grid">
        <div className="profile-edit-summary">
          <div className="profile-edit-avatar-wrap">
            <div className="profile-edit-avatar" style={avatarStyle(form)}>
              {!form.avatarImage && user.name.charAt(0).toUpperCase()}
            </div>
            <input type="file" id="edit-avatar-input" className="d-none" accept="image/*" onChange={handleEditAvatarChange} />
            <label htmlFor="edit-avatar-input" className="profile-camera-button" aria-label="Change profile photo"><i className="bi bi-camera-fill"></i></label>
          </div>
          <h5 className="fw-bold mb-0">{user.name} <i className="bi bi-patch-check-fill profile-verified"></i></h5>
          <p className="text-muted small mb-3">{user.title || "Add your job title"}</p>
          <span className="badge profile-edit-role-badge mb-3">{user.role}</span>

          <div className="profile-edit-contact">
            <div><i className="bi bi-envelope"></i> {user.email}</div>
            <div><i className="bi bi-telephone"></i> {user.phone || "Not added"}</div>
            <div><i className="bi bi-calendar-check"></i> Joined {formatDate(user.createdAt)}</div>
            <div><i className="bi bi-geo-alt"></i> {user.location || "Not added"}</div>
          </div>

          <hr />
          <div className="profile-edit-stats">
            <div>
              <span className="profile-metric-icon violet"><i className="bi bi-briefcase"></i></span>
              <div className="fw-bold fs-5">{applications.length}</div>
              <div className="text-muted small">Applications</div>
            </div>
            <div>
              <span className="profile-metric-icon teal"><i className="bi bi-bookmark"></i></span>
              <div className="fw-bold fs-5">{savedIds.length}</div>
              <div className="text-muted small">Saved Jobs</div>
            </div>
          </div>
        </div>

        <div className="profile-edit-form-panel">
          <div className="profile-edit-form-header">
            <h5 className="fw-bold mb-0">Edit Profile Details</h5>
            <button type="button" className="btn btn-sm rounded-pill profile-edit-cancel-btn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Job Title</label>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Experience</label>
                <select
                  className="form-select"
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
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Skills (comma separated)</label>
              <input
                className="form-control"
                placeholder="React, Node.js, SQL"
                value={form.skillsInput}
                onChange={(e) => setForm({ ...form, skillsInput: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Resume</label>
              <div className="file-upload-box">
                <input type="file" id="profile-resume" className="d-none" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                <label htmlFor="profile-resume" className="d-flex align-items-center gap-2 mb-0 w-100" style={{ cursor: "pointer" }}>
                  <i className="bi bi-cloud-arrow-up fs-4 text-primary"></i>
                  <span className="text-muted small">
                    {form.resumeName ? (
                      <span className="fw-semibold profile-edit-resume-name">{form.resumeName}</span>
                    ) : (
                      "Click to upload resume"
                    )}
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
