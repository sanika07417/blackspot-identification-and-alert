import { Seo } from "@/components/Seo";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, FileText, LogOut, Plus, User, XCircle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Container,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  SampleNotice,
  StatCard,
  StatusBadge,
  fmt,
} from "@/components/kit";
import { RequireAuth } from "@/components/RequireAuth";
import { useApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

function DashboardContent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useApi("/api/reports/mine");
  const r = data ?? [];
  const c = (s) => r.filter((x) => s.includes(x.status)).length;

  return (
    <Container className="py-8">
      <PageHeader
        eyebrow={`Welcome, ${user?.name}`}
        title="My Reports"
        description="You only see reports you submitted."
        actions={
          <>
            <Button variant="safe" asChild>
              <Link to="/report">
                <Plus />
                Report New Incident
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <User />
                Profile
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut />
              Logout
            </Button>
          </>
        }
      />
      <SampleNotice className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={r.length} icon={<FileText className="size-5" />} />
        <StatCard
          label="Pending"
          value={c(["PENDING"])}
          icon={<Clock className="size-5" />}
          tone="caution"
        />
        <StatCard
          label="Verified"
          value={c(["VERIFIED", "PUBLISHED"])}
          icon={<CheckCircle2 className="size-5" />}
          tone="safe"
        />
        <StatCard
          label="Rejected"
          value={c(["REJECTED", "DUPLICATE"])}
          icon={<XCircle className="size-5" />}
          tone="danger"
        />
        <StatCard label="Resolved" value={c(["RESOLVED"])} icon={<Archive className="size-5" />} />
      </div>
      <div className="card-surface mt-6 overflow-x-auto">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <div className="p-4">
            <ErrorState />
          </div>
        ) : r.length === 0 ? (
          <EmptyState title="No reports yet" text="Your submitted reports will appear here." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                {["Report ID", "Category", "Location", "Submitted", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.map((x) => (
                <tr key={x.id} className="border-t">
                  <td className="px-4 py-3 font-mono">{x.id}</td>
                  <td className="px-4 py-3">{x.category}</td>
                  <td className="px-4 py-3">{x.location}</td>
                  <td className="px-4 py-3">{fmt(x.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={x.status} />
                  </td>
                  <td className="px-4 py-3">
                    <details>
                      <summary className="cursor-pointer text-safe">View Details</summary>
                      <p className="mt-2 max-w-xs text-xs text-muted-foreground">
                        {x.description}
                        {x.notes && (
                          <>
                            <br />
                            <b>Reviewer note:</b> {x.notes}
                          </>
                        )}
                      </p>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Container>
  );
}

export default function Dashboard() {
  return (
    <>
      <Seo
        title={"My Reports – RoadGuard"}
        description="Track the verification status of the incidents you reported."
      />
      <RequireAuth>
        <DashboardContent />
      </RequireAuth>
    </>
  );
}
