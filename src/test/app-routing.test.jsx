import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App routing", () => {
  it("renders the home page for / instead of falling back to not found", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Page not found")).toBeNull();
    expect(screen.getAllByText("RoadGuard").length).toBeGreaterThan(0);
  });

  it("shows the not-found page for unknown URLs", () => {
    render(
      <MemoryRouter initialEntries={["/nope"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Page not found")).toBeTruthy();
  });
});
