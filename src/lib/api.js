/**
 * API client prepared for the Spring Boot REST backend.
 * Set VITE_API_BASE_URL (e.g. http://localhost:8081) to use the real backend.
 * Without it, calls resolve with clearly-labelled SAMPLE data so the UI can be designed and demoed.
 * Authorization is enforced by Spring Security on the server; frontend route hiding is only UX.
 */
import { useQuery } from "@tanstack/react-query";
import { ALERTS, BLACKSPOTS, REPORTS, USERS, getAccidentRecords } from "./sample-data";

export const API_BASE = import.meta.env["VITE_API_BASE_URL"] ?? "";
export const IS_SAMPLE = !API_BASE;

const TOKEN_KEY = "roadguard.token";

async function http(path, init) {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

const delay = (v) => new Promise((r) => setTimeout(() => r(v), 350));

function sample(path) {
  if (path.startsWith("/api/dashboard/summary")) {
    const recs = getAccidentRecords();
    return {
      accidents: recs.length,
      hotspots: BLACKSPOTS.length,
      highRisk: BLACKSPOTS.filter((b) => b.risk === "HIGH").length,
      activeAlerts: ALERTS.filter((a) => a.status === "ACTIVE").length,
      pendingReviews: REPORTS.filter((r) => r.status === "PENDING").length,
      riskStatus: "ELEVATED",
    };
  }
  if (path.startsWith("/api/blackspots/"))
    return BLACKSPOTS.find((b) => b.id === path.split("/").pop()) ?? null;
  if (path.startsWith("/api/blackspots")) return BLACKSPOTS;
  if (path.startsWith("/api/accidents") || path.startsWith("/api/analytics/accidents"))
    return getAccidentRecords();
  if (path.startsWith("/api/alerts/active")) return ALERTS;
  if (path.startsWith("/api/alerts")) return ALERTS;
  if (path.startsWith("/api/reports/mine"))
    return REPORTS.filter((r) => r.reporter === "user@demo.in");
  if (path.startsWith("/api/reports")) return REPORTS;
  if (path.startsWith("/api/users")) return USERS;
  return null;
}

export function apiGet(path) {
  return IS_SAMPLE ? delay(sample(path)) : http(path);
}

export function apiSend(path, method, body) {
  if (IS_SAMPLE) return delay({ ok: true, ...body });
  const init = { method };
  if (body !== undefined) init.body = JSON.stringify(body);
  return http(path, init);
}

export function useApi(path) {
  return useQuery({ queryKey: [path], queryFn: () => apiGet(path) });
}

export const tokenStore = {
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};
