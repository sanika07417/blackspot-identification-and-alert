import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Flag, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Container,
  EmptyState,
  Loading,
  Pill,
  SampleNotice,
  StatusBadge,
  fmt,
} from "@/components/kit";
import { AlertTypeBadge } from "@/components/AlertCard";
import { LazyMap } from "@/components/LazyMap";
import { useApi } from "@/lib/api";

function AlertDetailContent() {
  const { id } = useParams();
  const { data, isLoading } = useApi("/api/alerts/active");
  if (isLoading) return <Loading />;
  const a = data?.find((x) => x.id === id);
  if (!a)
    return (
      <Container className="py-10">
        <EmptyState title="Incident not found" />
      </Container>
    );
  const rows = [
    ["Incident ID", <span className="font-mono">{a.id}</span>],
    ["Category", a.category],
    ["Severity", a.severity],
    [
      "Coordinates",
      <span className="font-mono">
        {a.lat}, {a.lng}
      </span>,
    ],
    ["Reported", fmt(a.reportedAt)],
    ["Latest update", fmt(a.updatedAt)],
    ["Verification", a.verified ? "Verified by reviewer" : "Unverified"],
    ["Source", a.source],
    ["Resolution", <StatusBadge status={a.status} />],
  ];
  return (
    <Container className="py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/alerts">
          <ArrowLeft />
          Back to Alerts
        </Link>
      </Button>
      <div className="flex flex-wrap gap-2">
        <AlertTypeBadge type={a.type} />
        <Pill className="border-border bg-secondary">{a.category}</Pill>
        <StatusBadge status={a.status} />
      </div>
      <h1 className="mt-3 text-3xl font-bold">{a.title}</h1>
      <p className="text-muted-foreground">
        {a.location}, {a.area}
      </p>
      <SampleNotice className="my-5" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="card-surface h-80 overflow-hidden">
            <LazyMap
              points={[
                {
                  id: a.id,
                  lat: a.lat,
                  lng: a.lng,
                  label: a.title,
                  color: a.type === "RED_ALERT" ? "danger" : "caution",
                  radius: 12,
                },
              ]}
              center={[a.lat, a.lng]}
              zoom={15}
            />
          </div>
          <div className="card-surface p-5">
            <h2 className="mb-2 font-bold">Description</h2>
            <p>{a.description}</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="card-surface p-5">
            <dl className="divide-y text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <Link to="/map">
                  <MapPinned />
                  View on Map
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.success("Thanks — your correction request was sent to reviewers.")
                }
              >
                <Flag />
                Report Incorrect Information
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default function AlertDetail() {
  const { id } = useParams();
  return (
    <>
      <Seo
        title={`Incident ${id} – RoadGuard`}
        description="Verified incident details, location and latest update."
      />
      <AlertDetailContent />
    </>
  );
}
