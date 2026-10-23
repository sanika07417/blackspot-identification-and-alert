import { createContext, useContext, useEffect, useState } from "react";
import { IS_SAMPLE, apiSend, tokenStore } from "./api";
import { USERS } from "./sample-data";

const KEY = "roadguard.user";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // A corrupt or half-written entry must not take the app down.
    try {
      const raw = localStorage.getItem(KEY);
      const saved = raw ? JSON.parse(raw) : null;
      if (saved && typeof saved.email === "string") setUser(saved);
    } catch {
      localStorage.removeItem(KEY);
    }
    setReady(true);
  }, []);

  async function login(email, password) {
    let u;
    if (IS_SAMPLE) {
      // DEMO ONLY: role comes from the backend (Spring Security) in production.
      await new Promise((r) => setTimeout(r, 500));
      u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.status === "ACTIVE");
      if (!u || password.length < 6) throw new Error("Invalid email or password.");
    } else {
      const res = await apiSend("/api/auth/login", "POST", { email, password });
      if (!res?.user?.email || !res.token) throw new Error("Sign-in failed. Please try again.");
      tokenStore.set(res.token);
      u = res.user;
    }
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }
  function logout() {
    localStorage.removeItem(KEY);
    tokenStore.clear();
    setUser(null);
  }
  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside AuthProvider");
  return c;
}

export function homeFor(role) {
  return role === "ADMIN" ? "/admin" : role === "REVIEWER" ? "/admin/verification" : "/dashboard";
}
