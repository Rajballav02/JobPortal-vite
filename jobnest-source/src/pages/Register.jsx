import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail, isValidPhone } from "../utils/format";

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Job Seeker",
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function passwordStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  const strength = passwordStrength(form.password);
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#198754"];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    else if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters.";

    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";

    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit phone number.";

    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";

    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";

    if (!form.agree) e.agree = "You must agree to the terms to continue.";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const res = register(form);
      setSubmitting(false);
      if (res.success) {
        showToast(`Account created successfully. Welcome, ${form.name.split(" ")[0]}!`, "success");
        navigate("/dashboard");
      } else {
        setErrors({ form: res.message });
      }
    }, 600);
  }

  return (
    <div className="auth-page d-flex align-items-center py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-8 col-lg-6">
            <div className="card auth-card border-0 shadow-lg fade-in-up">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-icon mx-auto mb-2">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h3 className="fw-bold">Create Your Account</h3>
                  <p className="text-muted">Join thousands of professionals finding their dream job</p>
                </div>

                {errors.form && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Sriyans"
                        autoComplete="off"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        placeholder="9876543210"
                        autoComplete="off"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="you@example.com"
                      autoComplete="off"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">I am a</label>
                    <div className="d-flex gap-3">
                      {["Job Seeker", "Employer"].map((r) => (
                        <div className="form-check" key={r}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="role"
                            id={`role-${r}`}
                            checked={form.role === r}
                            onChange={() => setForm({ ...form, role: r })}
                          />
                          <label className="form-check-label" htmlFor={`role-${r}`}>
                            {r}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Create a password"
                          autoComplete="new-password"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-light"
                          onClick={() => setShowPassword((s) => !s)}
                        >
                          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                      </div>
                      {form.password && (
                        <div className="mt-1">
                          <div className="strength-bar">
                            <div
                              className="strength-fill"
                              style={{
                                width: `${(strength / 4) * 100}%`,
                                background: strengthColors[strength],
                              }}
                            ></div>
                          </div>
                          <small style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</small>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      />
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className={`form-check-input ${errors.agree ? "is-invalid" : ""}`}
                      type="checkbox"
                      id="agree"
                      checked={form.agree}
                      onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="agree">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                    {errors.agree && <div className="invalid-feedback d-block">{errors.agree}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted small">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
