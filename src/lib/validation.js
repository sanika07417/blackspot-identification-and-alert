import { CATEGORIES } from "./sample-data";

// Service region bounding box (Sangli / Kolhapur districts, approx.)
export const REGION = { minLat: 16.4, maxLat: 17.2, minLng: 74.1, maxLng: 75.0 };

export function validateReport(d, now = new Date()) {
  const e = {};
  if (!CATEGORIES.includes(d.category)) e.category = "Choose a category.";
  if (d.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (!d.location.trim()) e.location = "Enter a location name.";
  const lat = Number(d.lat),
    lng = Number(d.lng);
  if (!d.lat || isNaN(lat) || lat < REGION.minLat || lat > REGION.maxLat)
    e.lat = "Latitude must be within the service region (16.4–17.2).";
  if (!d.lng || isNaN(lng) || lng < REGION.minLng || lng > REGION.maxLng)
    e.lng = "Longitude must be within the service region (74.1–75.0).";
  if (!d.datetime) e.datetime = "Enter when it happened.";
  else if (new Date(d.datetime) > now) e.datetime = "Incident time cannot be in the future.";
  if (d.description.trim().length < 20)
    e.description = "Describe the incident in at least 20 characters.";
  return e;
}

/** New citizen reports always start as PENDING; reporters can never set verified/published. */
export function buildReportPayload(d) {
  return { ...d, lat: Number(d.lat), lng: Number(d.lng), status: "PENDING" };
}

export function passwordStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return { score: s, label: ["Too weak", "Weak", "Fair", "Good", "Strong"][s] };
}

export function validatePassword(p) {
  if (p.length < 8) return "Use at least 8 characters.";
  if (!/\d/.test(p) || !/[A-Za-z]/.test(p)) return "Include letters and numbers.";
  return undefined;
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Alerts: expiry must be after start. */
export function validateAlertWindow(start, expiry) {
  if (!start || !expiry) return "Start and expiry time are required.";
  if (new Date(expiry) <= new Date(start)) return "Expiry must be after start time.";
  return undefined;
}

/** Workflow transitions allowed for reviewers. Verification never auto-publishes. */
export const REPORT_TRANSITIONS = {
  PENDING: ["VERIFIED", "REJECTED", "DUPLICATE"],
  VERIFIED: ["PUBLISHED", "RESOLVED"],
  PUBLISHED: ["RESOLVED"],
};
export const canTransition = (from, to) => (REPORT_TRANSITIONS[from] ?? []).includes(to);
