import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "jp_users";
const SESSION_KEY = "jp_session";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function simpleHash(str) {
  // Not real security - just avoids storing plain text in this demo app.
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `h${hash}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed a demo account so the "Use demo account" shortcut always works.
    const users = readUsers();
    if (!users.some((u) => u.email === "demo@jobnest.com")) {
      users.push({
        id: 1,
        name: "Demo User",
        email: "demo@jobnest.com",
        password: simpleHash("Demo@123"),
        phone: "9876543210",
        role: "Job Seeker",
        title: "Aspiring Frontend Developer",
        location: "Bengaluru, IN",
        bio: "Enthusiastic developer exploring new opportunities in tech.",
        skills: ["React", "JavaScript", "CSS"],
        experience: "1-2 years",
        resumeName: "",
        avatarColor: "hsl(210, 65%, 55%)",
        createdAt: new Date().toISOString(),
      });
      writeUsers(users);
    }

    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const found = users.find((u) => u.email === sessionEmail);
      if (found) setUser(stripPassword(found));
    }
    setLoading(false);
  }, []);

  function stripPassword(u) {
    const { password, ...rest } = u;
    return rest;
  }

  function register({ name, email, password, phone, role }) {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password: simpleHash(password),
      phone: phone || "",
      role: role || "Job Seeker",
      title: "",
      location: "",
      bio: "",
      skills: [],
      experience: "",
      resumeName: "",
      avatarColor: `hsl(${Math.floor(Math.random() * 360)}, 65%, 55%)`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    setUser(stripPassword(newUser));
    return { success: true };
  }

  function login({ email, password }) {
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, message: "No account found with this email." };
    if (found.password !== simpleHash(password)) {
      return { success: false, message: "Incorrect password. Please try again." };
    }
    localStorage.setItem(SESSION_KEY, found.email);
    setUser(stripPassword(found));
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  function updateProfile(updates) {
    const users = readUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx === -1) return { success: false, message: "User not found." };
    users[idx] = { ...users[idx], ...updates };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, users[idx].email);
    setUser(stripPassword(users[idx]));
    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
