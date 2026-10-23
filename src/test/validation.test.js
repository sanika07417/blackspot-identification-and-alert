import { describe, expect, it } from "vitest";
import {
  buildReportPayload,
  canTransition,
  validateAlertWindow,
  validatePassword,
  validateReport,
} from "@/lib/validation";
import { classifyRisk } from "@/lib/risk";

const good = {
  category: "Accident",
  title: "Bike skid",
  location: "Udgaon bridge",
  lat: "16.80",
  lng: "74.60",
  datetime: "2026-10-22T07:00",
  description: "A bike skidded on the bridge approach.",
};

describe("rules", () => {
  it("new reports are saved as PENDING", () => {
    expect(buildReportPayload(good).status).toBe("PENDING");
  });
  it("rejects coordinates outside the service region", () => {
    expect(validateReport({ ...good, lat: "19.07" }, new Date("2026-10-23")).lat).toBeDefined();
  });
  it("rejects future incident time", () => {
    expect(validateReport(good, new Date("2026-10-21")).datetime).toBeDefined();
  });
  it("verification cannot jump straight to published", () => {
    expect(canTransition("PENDING", "PUBLISHED")).toBe(false);
    expect(canTransition("VERIFIED", "PUBLISHED")).toBe(true);
  });
  it("alert expiry must be after start", () => {
    expect(validateAlertWindow("2026-10-22T10:00", "2026-10-22T09:00")).toBeDefined();
  });
  it("password needs 8+ chars with letters and numbers", () => {
    expect(validatePassword("abc123")).toBeDefined();
    expect(validatePassword("abcd1234")).toBeUndefined();
  });
  it("risk thresholds: 65 high, 40 medium", () => {
    expect(classifyRisk(65)).toBe("HIGH");
    expect(classifyRisk(64)).toBe("MEDIUM");
    expect(classifyRisk(39)).toBe("LOW");
  });
});
