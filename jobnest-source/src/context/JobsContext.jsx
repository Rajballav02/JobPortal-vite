import { createContext, useContext, useEffect, useState } from "react";
import { JOBS } from "../data/jobs";
import { useAuth } from "./AuthContext";

const JobsContext = createContext(null);

const SAVED_KEY = "jp_saved";
const APPLICATIONS_KEY = "jp_applications";
const NOTIFICATIONS_KEY = "jp_notifications";

function readStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}
function writeStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

const STATUS_FLOW = ["Applied", "In Review", "Shortlisted", "Rejected", "Hired"];

export function JobsProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const userKey = user?.email || null;

  useEffect(() => {
    if (!userKey) {
      setSavedIds([]);
      setApplications([]);
      setNotifications([]);
      return;
    }
    const savedStore = readStore(SAVED_KEY);
    const appStore = readStore(APPLICATIONS_KEY);
    const notifStore = readStore(NOTIFICATIONS_KEY);
    setSavedIds(savedStore[userKey] || []);
    setApplications(appStore[userKey] || []);
    let notifs = notifStore[userKey];
    if (!notifs) {
      notifs = [
        {
          id: Date.now(),
          title: "Welcome to JobNest!",
          message: "Complete your profile to get better job recommendations.",
          read: false,
          date: new Date().toISOString(),
          type: "info",
        },
      ];
      notifStore[userKey] = notifs;
      writeStore(NOTIFICATIONS_KEY, notifStore);
    }
    setNotifications(notifs);
  }, [userKey]);

  function persistSaved(next) {
    setSavedIds(next);
    const store = readStore(SAVED_KEY);
    store[userKey] = next;
    writeStore(SAVED_KEY, store);
  }

  function persistApplications(next) {
    setApplications(next);
    const store = readStore(APPLICATIONS_KEY);
    store[userKey] = next;
    writeStore(APPLICATIONS_KEY, store);
  }

  function persistNotifications(next) {
    setNotifications(next);
    const store = readStore(NOTIFICATIONS_KEY);
    store[userKey] = next;
    writeStore(NOTIFICATIONS_KEY, store);
  }

  function addNotification(title, message, type = "info") {
    if (!userKey) return;
    const next = [
      { id: Date.now() + Math.random(), title, message, read: false, date: new Date().toISOString(), type },
      ...notifications,
    ];
    persistNotifications(next);
  }

  function toggleSaveJob(jobId) {
    if (!userKey) return { success: false };
    const isSaved = savedIds.includes(jobId);
    const next = isSaved ? savedIds.filter((id) => id !== jobId) : [...savedIds, jobId];
    persistSaved(next);
    return { success: true, saved: !isSaved };
  }

  function isJobSaved(jobId) {
    return savedIds.includes(jobId);
  }

  function hasApplied(jobId) {
    return applications.some((a) => a.jobId === jobId);
  }

  function applyToJob(jobId, formData) {
    if (!userKey) return { success: false, message: "You must be logged in." };
    if (hasApplied(jobId)) return { success: false, message: "You already applied to this job." };
    const job = JOBS.find((j) => j.id === jobId);
    const application = {
      id: Date.now(),
      jobId,
      jobTitle: job?.title,
      company: job?.company,
      appliedDate: new Date().toISOString(),
      status: "Applied",
      ...formData,
    };
    const next = [application, ...applications];
    persistApplications(next);
    addNotification(
      "Application submitted",
      `Your application for ${job?.title} at ${job?.company} was submitted successfully.`,
      "success"
    );
    return { success: true };
  }

  function withdrawApplication(applicationId) {
    const app = applications.find((a) => a.id === applicationId);
    const next = applications.filter((a) => a.id !== applicationId);
    persistApplications(next);
    if (app) addNotification("Application withdrawn", `You withdrew your application for ${app.jobTitle}.`, "warning");
  }

  // Simulates status progression for demo purposes (deterministic, based on time since applied)
  function getEffectiveStatus(app) {
    if (app.status === "Withdrawn") return "Withdrawn";
    const daysSince = (Date.now() - new Date(app.appliedDate).getTime()) / 86400000;
    const seed = app.id % 5;
    if (daysSince < 0.0001) return "Applied";
    if (seed === 4 && daysSince > 0.15) return "Rejected";
    if (daysSince > 0.3) return "Hired";
    if (daysSince > 0.2) return "Shortlisted";
    if (daysSince > 0.08) return "In Review";
    return "Applied";
  }

  function markNotificationRead(id) {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(next);
  }

  function markAllNotificationsRead() {
    const next = notifications.map((n) => ({ ...n, read: true }));
    persistNotifications(next);
  }

  function clearNotifications() {
    persistNotifications([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <JobsContext.Provider
      value={{
        jobs: JOBS,
        savedIds,
        applications,
        notifications,
        unreadCount,
        toggleSaveJob,
        isJobSaved,
        hasApplied,
        applyToJob,
        withdrawApplication,
        getEffectiveStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        addNotification,
        STATUS_FLOW,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobsContext);
}
