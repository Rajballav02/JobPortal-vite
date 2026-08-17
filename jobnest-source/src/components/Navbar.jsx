import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { avatarStyle } from "../utils/format";
import { useJobs } from "../context/JobsContext";
import { useToast } from "../context/ToastContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useJobs();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  function closeMenu() {
    setOffcanvasOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    showToast("You have been logged out.", "info");
    navigate("/");
  }

  const links = [
    { to: "/", label: "Home", icon: "bi-house-door" },
    { to: "/jobs", label: "Find Jobs", icon: "bi-search" },
    { to: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  ];

  const userLinks = [
    { to: "/applied-jobs", label: "Applied Jobs", icon: "bi-send-check" },
    { to: "/saved-jobs", label: "Saved Jobs", icon: "bi-bookmark-heart" },
    { to: "/notifications", label: "Notifications", icon: "bi-bell", badge: unreadCount },
    { to: "/profile", label: "Profile", icon: "bi-person-circle" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg app-navbar sticky-top">
        <div className="container">
          <NavLink className="navbar-brand app-brand" to="/" onClick={closeMenu}>
            <i className="bi bi-briefcase-fill me-2"></i>JobNest
          </NavLink>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setOffcanvasOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list fs-2"></i>
          </button>

          <div className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-between">
            <ul className="navbar-nav ms-3 gap-1">
              {links.map((l) => (
                <li className="nav-item" key={l.to}>
                  <NavLink to={l.to} className="nav-link app-nav-link" end={l.to === "/"}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              {user &&
                userLinks.map((l) => (
                  <li className="nav-item" key={l.to}>
                    <NavLink to={l.to} className="nav-link app-nav-link position-relative">
                      {l.label}
                      {!!l.badge && (
                        <span className="badge rounded-pill bg-danger ms-1 notif-badge">{l.badge}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>

            <div className="d-flex align-items-center gap-2">
              {!user ? (
                <>
                  <NavLink to="/login" className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                    Login
                  </NavLink>
                  <NavLink to="/register" className="btn btn-primary btn-sm px-3 rounded-pill">
                    Sign Up
                  </NavLink>
                </>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn d-flex align-items-center gap-2 user-chip"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="avatar-circle" style={avatarStyle(user)}>
                      {!user.avatarImage && user.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="fw-semibold text-truncate" style={{ maxWidth: 110 }}>
                      {user.name}
                    </span>
                    <i className="bi bi-chevron-down small"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                    <li>
                      <NavLink className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>My Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/dashboard">
                        <i className="bi bi-speedometer2 me-2"></i>Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Offcanvas Sidebar */}
      <div className={`custom-offcanvas-backdrop ${offcanvasOpen ? "show" : ""}`} onClick={closeMenu}></div>
      <div className={`custom-offcanvas ${offcanvasOpen ? "show" : ""}`}>
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <span className="app-brand fs-5">
            <i className="bi bi-briefcase-fill me-2"></i>JobNest
          </span>
          <button className="btn-close" onClick={closeMenu} aria-label="Close"></button>
        </div>

        {user && (
          <div className="d-flex align-items-center gap-2 p-3 border-bottom">
            <span className="avatar-circle" style={avatarStyle(user)}>
              {!user.avatarImage && user.name?.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="fw-semibold">{user.name}</div>
              <div className="text-muted small">{user.email}</div>
            </div>
          </div>
        )}

        <div className="p-2 flex-grow-1 overflow-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className="offcanvas-link"
              onClick={closeMenu}
            >
              <i className={`bi ${l.icon} me-2`}></i>
              {l.label}
            </NavLink>
          ))}
          {user &&
            userLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className="offcanvas-link" onClick={closeMenu}>
                <i className={`bi ${l.icon} me-2`}></i>
                {l.label}
                {!!l.badge && <span className="badge rounded-pill bg-danger ms-2">{l.badge}</span>}
              </NavLink>
            ))}
        </div>

        <div className="p-3 border-top">
          {!user ? (
            <div className="d-grid gap-2">
              <NavLink to="/login" className="btn btn-outline-primary rounded-pill" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary rounded-pill" onClick={closeMenu}>
                Sign Up
              </NavLink>
            </div>
          ) : (
            <button className="btn btn-outline-danger w-100 rounded-pill" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
