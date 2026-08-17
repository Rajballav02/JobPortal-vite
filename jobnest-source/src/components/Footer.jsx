import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../utils/format";

export default function Footer() {
  const { showToast } = useToast();
  const [subscribeEmail, setSubscribeEmail] = useState("");

  function handleSubscribe(e) {
    e.preventDefault();
    if (!subscribeEmail.trim() || !isValidEmail(subscribeEmail)) {
      showToast("Enter a valid email address to subscribe.", "error");
      return;
    }
    showToast("You're subscribed! We'll send new opportunities your way.", "success");
    setSubscribeEmail("");
  }

  return (
    <footer className="app-footer">
      <div className="container py-4">
        <div className="row g-3">
          <div className="col-md-4">
            <h5 className="text-white fw-bold mb-2">
              <i className="bi bi-briefcase-fill me-2"></i>JobNest
            </h5>
            <p className="text-white-50 small mb-0">
              JobNest helps you discover opportunities that match your skills and ambitions. Search, apply, and track
              your career journey — all in one place.
            </p>
          </div>
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-2">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/jobs">Find Jobs</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white fw-semibold mb-2">Resources</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/applied-jobs">Applied Jobs</Link>
              </li>
              <li>
                <Link to="/saved-jobs">Saved Jobs</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-white fw-semibold mb-2">Stay Updated</h6>
            <p className="text-white-50 small mb-2">Subscribe to get the latest job opportunities and career tips.</p>
            <form className="footer-subscribe mb-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            <div className="d-flex gap-2">
              {["facebook", "twitter-x", "linkedin", "instagram"].map((icon) => (
                <a href="#" key={icon} className="social-icon" onClick={(e) => e.preventDefault()}>
                  <i className={`bi bi-${icon}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-secondary mt-3 mb-2" />
        <p className="text-center text-white-50 small mb-0">
          &copy; {new Date().getFullYear()} JobNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
