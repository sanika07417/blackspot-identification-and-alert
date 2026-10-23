import { Seo } from "@/components/Seo";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Info, Lightbulb, TriangleAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Container,
  EmptyState,
  ErrorState,
  Loading,
  RiskBadge,
  SampleNotice,
} from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { useApi } from "@/lib/api";

import { riskColor } from "@/lib/risk";

const SEV_COLORS = ["var(--danger)", "var(--caution)", "var(--chart-5)", "var(--safe)"];

function BlackspotDetailContent() {
  const { id } = useParams();
  const { data: b, isLoading, isError } = useApi(`/api/blackspots/${id}`);
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <Container className="py-10">
        <ErrorState />
      </Container>
    );
  if (!b)
    return (
      <Container className="py-10">
        <EmptyState title="Location not found" text="This black spot may have been removed." />
      </Container>
    );

  const sev = [
    { name: "Fatal", value: b.severity.fatal },
    { name: "Grievous", value: b.severity.grievous },
    { name: "Minor", value: b.severity.minor },
    { name: "Damage only", value: b.severity.damageOnly },
  ];

  return (
    <Container className="py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/map">
          <ArrowLeft />
          Back to map
        </Link>
      </Button>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-safe">
            {b.id} · {b.area}
          </p>
          <h1 className="text-3xl font-bold">{b.name}</h1>
          <p className="text-muted-foreground">
            {b.road} ·{" "}
            <span className="font-mono">
              {b.lat}, {b.lng}
            </span>
          </p>
        </div>
        <RiskBadge risk={b.risk} />
      </div>
      <SampleNotice className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface h-80 overflow-hidden lg:col-span-2">
          <LazyMap
            points={[
              {
                id: b.id,
                lat: b.lat,
                lng: b.lng,
                label: b.name,
                color: riskColor(b.risk),
                radius: 14,
              },
            ]}
            center={[b.lat, b.lng]}
            zoom={15}
            heat
          />
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Estimated risk score</p>
          <p className="font-display text-5xl font-extrabold">
            {b.riskScore}
            <span className="text-xl text-muted-foreground">/100</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full ${b.risk === "HIGH" ? "bg-danger" : b.risk === "MEDIUM" ? "bg-caution" : "bg-safe"}`}
              style={{ width: `${b.riskScore}%` }}
            />
          </div>
          <p className="mt-4 text-sm">{b.explanation}</p>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted p-2">
              <p className="text-xl font-bold">{b.accidents}</p>
              <p className="text-xs text-muted-foreground">Accidents</p>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <p className="text-xl font-bold">{b.injuries}</p>
              <p className="text-xs text-muted-foreground">Injuries</p>
            </div>
            <div className="rounded-lg bg-danger-soft p-2">
              <p className="text-xl font-bold text-danger">{b.fatalities}</p>
              <p className="text-xs text-muted-foreground">Fatalities</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold">Accident timeline (historical)</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={b.yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  dataKey="accidents"
                  stroke="var(--navy)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "var(--caution)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-surface p-5">
          <h2 className="mb-4 font-bold">Severity distribution</h2>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={sev} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {sev.map((_, i) => (
                    <Cell key={i} fill={SEV_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {sev.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: SEV_COLORS[i] }} />
                {s.name}: {s.value}
              </span>
            ))}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <TriangleAlert className="size-4 text-caution" />
            Related hazards
          </h2>
          <ul className="space-y-2 text-sm">
            {b.hazards.map((h) => (
              <li key={h} className="rounded-md bg-caution-soft px-3 py-2">
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Lightbulb className="size-4 text-safe" />
            Safety recommendations
          </h2>
          <ul className="space-y-2 text-sm">
            {b.recommendations.map((h) => (
              <li key={h} className="rounded-md bg-safe-soft px-3 py-2">
                {h}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold">
            <Info className="size-4" />
            Data & methodology
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Source</dt>
              <dd>Project accident dataset</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Date range</dt>
              <dd>{b.dateRange}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Last analysis</dt>
              <dd>{b.lastAnalysis}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            This is a hotspot identified from historical data. It is not an official black-spot
            designation unless confirmed by the relevant authority.
          </p>
        </div>
      </div>
      <div className="mt-6 card-surface p-5">
        <h2 className="mb-3 font-bold">Yearly accidents</h2>
        <div className="h-48">
          <ResponsiveContainer>
            <BarChart data={b.yearly}>
              <XAxis dataKey="year" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="accidents" fill="var(--safe)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Container>
  );
}

export default function BlackspotDetail() {
  const { id } = useParams();
  return (
    <>
      <Seo
        title={`Black Spot ${id} – RoadGuard`}
        description="Accident history, severity, risk score and safety recommendations for this location."
      />
      <BlackspotDetailContent />
    </>
  );
}
