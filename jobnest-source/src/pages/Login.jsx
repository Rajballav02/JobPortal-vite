import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../utils/format";
import FormField from "../components/FormField";

export default function Login() {
  const { login, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Always land on a clean, empty form -- never carry over a previous
  // session's typed values (e.g. right after logging out).
  useEffect(() => {
    if (!user) {
      setForm({ email: "", password: "" });
      setErrors({});
    }
  }, [user]);

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      const res = login(form);
      setSubmitting(false);
      if (res.success) {
        showToast("Welcome back! Logged in successfully.", "success");
        navigate(location.state?.from?.pathname || "/dashboard");
      } else {
        setErrors({ form: res.message });
      }
    }, 500);
  }

  function fillDemo() {
    setForm({ email: "demo@jobnest.com", password: "Demo@123" });
  }

  return (
    <div className="auth-page d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-xl-10 col-xxl-9">
            <div className="auth-card auth-card-login border-0 shadow-lg fade-in-up">
              <aside className="auth-showcase">
                <div className="auth-showcase-content">
                  <span className="auth-showcase-kicker"><i className="bi bi-stars"></i> Your career, elevated</span>
                  <h1>Find work that<br /><span>feels like you.</span></h1>
                  <p>Discover opportunities from ambitious teams and take the next step with confidence.</p>
                  <div className="auth-benefit-list">
                    <div><span><i className="bi bi-lightning-charge-fill"></i></span>Apply to curated roles</div>
                    <div><span><i className="bi bi-graph-up-arrow"></i></span>Track every application</div>
                    <div><span><i className="bi bi-shield-check"></i></span>Built for your privacy</div>
                  </div>
                </div>
                <div className="auth-showcase-orb orb-one"></div>
                <div className="auth-showcase-orb orb-two"></div>
              </aside>
              <div className="auth-form-panel">
                <div className="text-center mb-4">
                  <div className="auth-icon mx-auto mb-2">
                    <i className="bi bi-briefcase-fill"></i>
                  </div>
                  <span className="auth-form-kicker">Welcome back</span>
                  <h2 className="fw-bold">Let&apos;s get you hired.</h2>
                  <p className="text-muted">Login to continue your job search journey</p>
                </div>

                {errors.form && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <FormField
                    id="login-email"
                    label="Email address"
                    icon="bi-envelope"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                    value={form.email}
                    error={errors.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <FormField
                    id="login-password"
                    label="Password"
                    icon="bi-lock"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="off"
                    value={form.password}
                    error={errors.password}
                    className="mb-2"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    endAdornment={
                      <button type="button" className="input-group-text bg-light" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    }
                  />

                  <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" defaultChecked />
                      <label className="form-check-label small" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <button type="button" className="btn btn-link btn-sm p-0" onClick={fillDemo}>
                      Use demo account
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 text-muted small">
                  Don't have an account? <Link to="/register">Create one</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
