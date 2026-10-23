import { Link } from "react-router-dom";
import { Bell, ClipboardCheck, Database, MapPinned, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, RiskBadge, SampleNotice, StatCard, StatusBadge, fmt } from "@/components/kit";
import { RequireAuth } from "@/components/RequireAuth";
import { useApi } from "@/lib/api";
import { BLACKSPOTS, REPORTS } from "@/lib/sample-data";

function AdminHomeContent() {
  const { data } = useApi("/api/dashboard/summary");
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of records, hotspots, reviews and alerts."
        actions={
          <>
            <Button variant="safe" asChild>
              <Link to="/admin/alerts">
                <Plus />
                New alert
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/import">
                <Upload />
                Import CSV
              </Link>
            </Button>
          </>
        }
      />
      <SampleNotice className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Accident records"
          value={data?.accidents ?? "—"}
          icon={<Database className="size-5" />}
        />
        <StatCard
          label="Black spots"
          value={data?.hotspots ?? "—"}
          icon={<MapPinned className="size-5" />}
          tone="safe"
        />
        <StatCard
          label="Pending reviews"
          value={data?.pendingReviews ?? "—"}
          icon={<ClipboardCheck className="size-5" />}
          tone="caution"
        />
        <StatCard
          label="Active alerts"
          value={data?.activeAlerts ?? "—"}
          icon={<Bell className="size-5" />}
          tone="danger"
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card-surface xl:col-span-2">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-bold">Recent reports</h2>
            <Button size="sm" variant="outline" asChild>
              <Link to="/admin/verification">Review queue</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {REPORTS.slice(0, 5).map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3">{r.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-surface">
          <h2 className="border-b p-4 font-bold">High-risk locations</h2>
          <ul>
            {BLACKSPOTS.filter((b) => b.risk === "HIGH").map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-2 border-b px-4 py-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.accidents} accidents · score {b.riskScore}
                  </p>
                </div>
                <RiskBadge risk={b.risk} />
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface xl:col-span-2">
          <h2 className="border-b p-4 font-bold">Recent activity</h2>
          <ul className="divide-y text-sm">
            {[
              ["reviewer.patil", "published alert ALT-2041", "2026-10-22T07:45"],
              ["reviewer.patil", "verified report RPT-50228", "2026-10-22T06:10"],
              ["admin.kulkarni", "created alert ALT-2039", "2026-10-21T09:00"],
              ["admin.kulkarni", "imported 102 accident records", "2026-10-15T11:20"],
            ].map(([w, a, t]) => (
              <li key={a} className="flex justify-between gap-4 px-4 py-3">
                <span>
                  <b>{w}</b> {a}
                </span>
                <span className="shrink-0 text-muted-foreground">{fmt(t ?? "")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-4">
          <h2 className="mb-3 font-bold">Quick actions</h2>
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/records">
                <Database />
                Add accident record
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/verification">
                <ClipboardCheck />
                Verify reports
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/alerts">
                <Bell />
                Manage alerts
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link to="/admin/users">
                <MapPinned />
                Users & roles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminHome() {
  return (
    <>
      <RequireAuth roles={["ADMIN"]}>
        <AdminHomeContent />
      </RequireAuth>
    </>
  );
}
