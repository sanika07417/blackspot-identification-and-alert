export const riskColor = (r) => (r === "HIGH" ? "danger" : r === "MEDIUM" ? "caution" : "safe");

/** Classification thresholds used across the UI (score 0–100). */
export function classifyRisk(score) {
  if (score >= 65) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}
