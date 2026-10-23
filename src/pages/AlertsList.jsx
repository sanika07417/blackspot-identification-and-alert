import { Seo } from "@/components/Seo";
import { useMemo, useState } from "react";
import { Search, Siren, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Container,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  SampleNotice,
  selectCls,
} from "@/components/kit";
import { AlertCard } from "@/components/AlertCard";
import { useApi } from "@/lib/api";
import { AREAS, CATEGORIES } from "@/lib/sample-data";

function AlertsListContent() {
  const { data, isLoading, isError } = useApi("/api/alerts/active");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const [sev, setSev] = useState("");
  const [status, setStatus] = useState("");
  const list = useMemo(
    () =>
      (data ?? [])
        .filter(
          (a) =>
            a.verified &&
            a.status !== "DRAFT" &&
            a.status !== "DEACTIVATED" &&
            (!q || `${a.title} ${a.location}`.toLowerCase().includes(q.toLowerCase())) &&
            (!cat || a.category === cat) &&
            (!area || a.area === area) &&
            (!sev || a.severity === sev) &&
            (!status || a.status === status),
        )
        .sort((a, b) => (a.status === "ACTIVE" ? 0 : 1) - (b.status === "ACTIVE" ? 0 : 1)),
    [data, q, cat, area, sev, status],
  );

  return (
    <Container className="py-8">
      <PageHeader
        eyebrow="Live"
        title="Alerts & Incidents"
        description="Only reviewer-approved alerts are shown. Resolved and expired alerts are clearly marked."
      />
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-caution/50 bg-caution-soft p-3 text-sm">
          <TriangleAlert className="size-5 text-navy" />
          <span>
            <b>Drive Safe</b> — caution advised, proceed carefully.
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger">
          <Siren className="size-5" />
          <span>
            <b>Red Alert</b> — urgent / high risk, avoid if possible.
          </span>
        </div>
      </div>
      <div className="card-surface mb-6 grid gap-3 p-4 md:grid-cols-5">
        <div className="relative md:col-span-1">
          <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className={selectCls}
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="Category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={area}
          onChange={(e) => setArea(e.target.value)}
          aria-label="Location"
        >
          <option value="">All locations</option>
          {AREAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          aria-label="Severity"
        >
          <option value="">Any severity</option>
          {["High", "Medium", "Low"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          className={selectCls}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Status"
        >
          <option value="">Any status</option>
          {["ACTIVE", "RESOLVED", "EXPIRED"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <SampleNotice className="mb-4" />
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState />
      ) : list.length === 0 ? (
        <EmptyState title="No alerts match" text="Try clearing filters." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default function AlertsList() {
  return (
    <>
      <Seo
        title={"Alerts & Incidents – RoadGuard"}
        description="Verified road alerts: accidents, traffic jams, road blocks, construction, fallen trees and waterlogging."
      />
      <AlertsListContent />
    </>
  );
}
