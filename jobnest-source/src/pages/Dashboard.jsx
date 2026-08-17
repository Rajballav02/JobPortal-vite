import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import { formatDate, timeAgo, avatarStyle } from "../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const { applications, savedIds, jobs, getEffectiveStatus, notifications, unreadCount } = useJobs();

  const stats = useMemo(() => {
    const enriched = applications.map((a) => ({ ...a, effectiveStatus: getEffectiveStatus(a) }));
    return {
      total: applications.length,
      inReview: enriched.filter((a) => a.effectiveStatus === "In Review").length,
      shortlisted: enriched.filter((a) => a.effectiveStatus === "Shortlisted").length,
      hired: enriched.filter((a) => a.effectiveStatus === "Hired").length,
      rejected: enriched.filter((a) => a.effectiveStatus === "Rejected").length,
      saved: savedIds.length,
    };
  }, [applications, savedIds, getEffectiveStatus]);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5)
    .map((a) => ({ ...a, effectiveStatus: getEffectiveStatus(a) }));

  const recommended = jobs
    .filter((j) => !applications.some((a) => a.jobId === j.id))
    .filter((j) => user.skills?.some((s) => j.skills.includes(s)) || user.title?.includes(j.category))
    .slice(0, 3);

  const fallbackRecommended = recommended.length ? recommended : jobs.slice(0, 3);

  const profileCompletion = useMemo(() => {
    const fields = [user.name, user.email, user.phone, user.title, user.location, user.bio, user.skills?.length, user.experience];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const STATUS_STYLES = {
    Applied: "status-applied",
    "In Review": "status-review",
    Shortlisted: "status-shortlisted",
    Rejected: "status-rejected",
    Hired: "status-hired",
    Withdrawn: "status-withdrawn",
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="dashboard-admin-shell">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-sidebar-brand"><span><i className="bi bi-briefcase-fill"></i></span>JobNest</Link>
        <div className="dashboard-sidebar-user"><div style={avatarStyle(user)}>{!user.avatarImage && user.name.charAt(0).toUpperCase()}</div><span><strong>{user.name.split(" ")[0]}</strong><small>Job seeker</small></span></div>
        <nav className="dashboard-sidebar-nav">
          <Link className="active" to="/dashboard"><i className="bi bi-grid-1x2-fill"></i>Dashboard</Link><Link to="/jobs"><i className="bi bi-search"></i>Find jobs</Link><Link to="/applied-jobs"><i className="bi bi-send"></i>Applications</Link><Link to="/saved-jobs"><i className="bi bi-bookmark-heart"></i>Saved jobs</Link><Link to="/notifications"><i className="bi bi-bell"></i>Notifications{unreadCount > 0 && <span className="dashboard-sidebar-badge">{unreadCount}</span>}</Link><Link to="/profile"><i className="bi bi-person-gear"></i>My profile</Link>
        </nav>
        <div className="dashboard-sidebar-footer"><i className="bi bi-lightning-charge-fill"></i><span><strong>Stand out faster</strong><small>{profileCompletion}% profile complete</small></span><Link to="/profile"><i className="bi bi-arrow-up-right"></i></Link></div>
      </aside>
      <main className="dashboard-admin-main">
        <header className="dashboard-topbar">
          <div><span>OVERVIEW</span><h1>{greeting}, {user.name.split(" ")[0]}!</h1></div>
          <div className="dashboard-topbar-actions">
            <Link to="/jobs" className="dashboard-search"><i className="bi bi-search"></i><span>Search jobs, companies...</span></Link>
            <Link to="/notifications" className="dashboard-topbar-icon position-relative">
              <i className="bi bi-bell"></i>
              {unreadCount > 0 && <span className="dashboard-topbar-badge">{unreadCount}</span>}
            </Link>
            <Link to="/profile" className="dashboard-topbar-avatar" style={avatarStyle(user)}>{!user.avatarImage && user.name.charAt(0).toUpperCase()}</Link>
          </div>
        </header>
        <section className="dashboard-welcome-banner"><div><span><i className="bi bi-stars"></i> CAREER COMMAND CENTRE</span><h2>Your next great role is<br />closer than you think.</h2><p>Keep every application, recommendation and career milestone in one place.</p><Link to="/jobs" className="btn">Explore jobs <i className="bi bi-arrow-right"></i></Link></div><div className="dashboard-welcome-art"><i className="bi bi-rocket-takeoff-fill"></i></div></section>
        <section className="dashboard-admin-stats">{[{ label: "Applications sent", value: stats.total, icon: "bi-send-fill", color: "violet", to: "/applied-jobs" }, { label: "In review", value: stats.inReview, icon: "bi-hourglass-split", color: "blue", to: "/applied-jobs" }, { label: "Shortlisted", value: stats.shortlisted, icon: "bi-star-fill", color: "pink", to: "/applied-jobs" }, { label: "Saved roles", value: stats.saved, icon: "bi-bookmark-heart-fill", color: "green", to: "/saved-jobs" }].map((s) => <Link to={s.to} className={`dashboard-admin-stat ${s.color}`} key={s.label}><span><i className={`bi ${s.icon}`}></i></span><div><small>{s.label}</small><strong>{s.value}</strong></div><i className="bi bi-arrow-up-right"></i></Link>)}</section>
        <section className="dashboard-admin-grid">
          <div className="dashboard-applications-card"><div className="admin-card-heading"><div><span>APPLICATION TRACKER</span><h3>Recent applications</h3></div><Link to="/applied-jobs">View all <i className="bi bi-arrow-right"></i></Link></div>{recentApplications.length === 0 ? <div className="dashboard-admin-empty"><div className="admin-empty-icon"><i className="bi bi-send"></i></div><div><h4>Ready when you are.</h4><p>Discover jobs that match your skills and start applying today.</p><Link to="/jobs" className="btn">Find jobs <i className="bi bi-arrow-right"></i></Link></div></div> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Job</th><th>Applied</th><th>Status</th></tr></thead><tbody>{recentApplications.map((a) => <tr key={a.id}><td><strong>{a.jobTitle}</strong><small>{a.company}</small></td><td>{formatDate(a.appliedDate)}</td><td><span className={`status-badge ${STATUS_STYLES[a.effectiveStatus]}`}>{a.effectiveStatus}</span></td></tr>)}</tbody></table></div>}</div>
          <div className="dashboard-profile-card"><div className="admin-card-heading"><div><span>PROFILE STRENGTH</span><h3>Stand out to recruiters</h3></div><Link to="/profile"><i className="bi bi-arrow-up-right"></i></Link></div><div className="dashboard-profile-score"><strong>{profileCompletion}<small>%</small></strong><span>Complete</span></div><div className="progress"><div className="progress-bar" style={{ width: `${profileCompletion}%` }}></div></div><p>{profileCompletion >= 100 ? "Your profile is complete. Nice work!" : "Complete your profile to get stronger recommendations."}</p><Link to="/profile" className="dashboard-text-link">Complete profile <i className="bi bi-arrow-right"></i></Link></div>
          <div className="dashboard-recommendations-card"><div className="admin-card-heading"><div><span>FOR YOU</span><h3>Recommended roles</h3></div><Link to="/jobs">See all</Link></div>{fallbackRecommended.length === 0 ? <p className="dashboard-panel-empty-text">No open roles right now — check back soon.</p> : fallbackRecommended.map((job) => <Link to={`/jobs/${job.id}`} key={job.id} className="dashboard-recommendation"><div className="job-logo">{job.logo}</div><div><strong>{job.title}</strong><small>{job.company} · {job.location}</small></div><i className="bi bi-chevron-right"></i></Link>)}</div>
          <div className="dashboard-notifications-card"><div className="admin-card-heading"><div><span>UPDATES</span><h3>Notifications</h3></div><Link to="/notifications">View all</Link></div>{notifications.length === 0 ? <p className="dashboard-panel-empty-text">You're all caught up.</p> : notifications.slice(0, 3).map((n) => <div key={n.id} className={`dashboard-admin-notification ${!n.read ? "unread" : ""}`}><span><i className="bi bi-bell-fill"></i></span><div><strong>{n.title}</strong><small>{timeAgo(n.date)}</small></div></div>)}</div>
        </section>
      </main>
    </div>
  );
}
