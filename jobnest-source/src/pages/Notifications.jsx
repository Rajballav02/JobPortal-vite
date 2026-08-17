import { useJobs } from "../context/JobsContext";
import { timeAgo } from "../utils/format";

const TYPE_ICON = {
  success: "bi-check-circle-fill text-success",
  warning: "bi-exclamation-triangle-fill text-warning",
  info: "bi-info-circle-fill text-primary",
  error: "bi-x-circle-fill text-danger",
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications, unreadCount } =
    useJobs();

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-0">Notifications</h3>
          <p className="text-muted mb-0">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : "You're all caught up!"}
          </p>
        </div>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={markAllNotificationsRead}>
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={clearNotifications}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bell-slash display-1 text-muted"></i>
          <h5 className="mt-3">No notifications</h5>
          <p className="text-muted">We'll notify you when there's something new.</p>
        </div>
      ) : (
        <div className="list-group notification-list shadow-sm">
          {notifications.map((n) => (
            <button
              key={n.id}
              className={`list-group-item list-group-item-action d-flex gap-3 py-3 ${!n.read ? "unread-notif" : ""}`}
              onClick={() => markNotificationRead(n.id)}
            >
              <i className={`bi ${TYPE_ICON[n.type] || TYPE_ICON.info} fs-4`}></i>
              <div className="flex-grow-1 text-start">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">{n.title}</span>
                  {!n.read && <span className="dot-unread"></span>}
                </div>
                <div className="text-muted small">{n.message}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {timeAgo(n.date)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
