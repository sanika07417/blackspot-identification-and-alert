import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertOctagon,
  ArrowRight,
  BellRing,
  CloudSun,
  Database,
  MapPinned,
  Search,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import hero from "@/assets/hero-road.jpg";
import { Button } from "@/components/ui/button";
import { Container, ErrorState, Loading, SampleNotice, StatCard } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { AlertCard } from "@/components/AlertCard";
import { useApi } from "@/lib/api";

import { riskColor } from "@/lib/risk";

function HomeContent() {
  const summary = useApi("/api/dashboard/summary");
  const spots = useApi("/api/blackspots");
  const alerts = useApi("/api/alerts/active");

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Highway bridge over the Krishna river at dusk"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-2xl text-navy-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <ShieldCheck className="size-3.5" />
              SIH26001 · Road Safety
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
              Know the Risk.
              <br />
              <span className="text-caution">Drive Safe.</span>
            </h1>
            <p className="mt-5 text-lg text-navy-foreground/80">
              RoadGuard maps accident-prone locations around Jaysingpur, Sangli, Miraj, Ichalkaranji
              and Kurundwad, explains why they're risky, and shares verified road alerts — so you
              can plan safer journeys.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="caution" asChild>
                <Link to="/map">
                  <MapPinned />
                  Explore Black Spots
                </Link>
              </Button>
              <Button size="lg" variant="heroOutline" asChild>
                <Link to="/alerts">
                  <BellRing />
                  View Alerts
                </Link>
              </Button>
            </div>
          </div>
        </Container>
        <div className="road-stripe relative" />
      </section>

      <Container className="-mt-8 relative">
        {summary.isError ? (
          <ErrorState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Recorded accidents"
              value={summary.data?.accidents ?? "—"}
              icon={<Database className="size-5" />}
              hint="Historical dataset"
            />
            <StatCard
              label="Identified hotspots"
              value={summary.data?.hotspots ?? "—"}
              icon={<MapPinned className="size-5" />}
              tone="safe"
              hint="From analysis, not official"
            />
            <StatCard
              label="Active verified alerts"
              value={summary.data?.activeAlerts ?? "—"}
              icon={<BellRing className="size-5" />}
              tone="danger"
              hint="Approved for public view"
            />
            <StatCard
              label="Current risk status"
              value={summary.data?.riskStatus ?? "—"}
              icon={<Activity className="size-5" />}
              tone="caution"
              hint="Estimated, region-wide"
            />
          </div>
        )}
        <SampleNotice className="mt-4" />
      </Container>

      <Container className="mt-14 grid gap-6 lg:grid-cols-3">
        <div className="card-surface overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-bold">Black spots at a glance</h2>
              <p className="text-sm text-muted-foreground">
                Historical accident hotspots, colour-coded by estimated risk.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/map">
                Open full map
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="h-[380px]">
            <LazyMap
              points={(spots.data ?? []).map((b) => ({
                id: b.id,
                lat: b.lat,
                lng: b.lng,
                label: b.name,
                sub: `${b.accidents} accidents · ${b.risk}`,
                color: riskColor(b.risk),
                radius: 8 + b.accidents / 3,
              }))}
              zoom={11}
            />
          </div>
          <div className="flex flex-wrap gap-4 border-t p-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-safe" />
              Lower risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-caution" />
              Medium risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-full bg-danger" />
              High risk
            </span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <CloudSun className="size-5 text-caution" />
              <h3 className="font-bold">Weather</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Live weather is not connected yet. When a weather API is configured on the backend,
              current conditions for each area appear here.
            </p>
            <p className="mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              Placeholder — no weather data available
            </p>
          </div>
          <div className="card-surface p-5">
            <h3 className="mb-3 font-bold">Safety tips</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                "Slow down near bridges, junctions and bends.",
                "Always wear a helmet / seatbelt.",
                "Use low beam at night on two-lane roads.",
                "Avoid driving through waterlogged stretches.",
                "Report hazards — help others stay safe.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0 text-caution" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container className="mt-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recent verified alerts</h2>
            <p className="text-muted-foreground">
              Only alerts approved by reviewers are shown publicly.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/alerts">
              All alerts
              <ArrowRight />
            </Link>
          </Button>
        </div>
        {alerts.isLoading ? (
          <Loading />
        ) : alerts.isError ? (
          <ErrorState />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {(alerts.data ?? [])
              .filter((a) => a.status === "ACTIVE")
              .slice(0, 3)
              .map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
          </div>
        )}
      </Container>

      <Container className="mt-16">
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            {
              i: Database,
              t: "Historical data",
              d: "Accident records are imported and validated from the project dataset.",
            },
            {
              i: Search,
              t: "Hotspot analysis",
              d: "Locations are clustered and scored by count, injuries and fatalities.",
            },
            {
              i: AlertOctagon,
              t: "Verified reports",
              d: "Citizens report incidents; police reviewers verify them before anything is published.",
            },
            {
              i: BellRing,
              t: "Public alerts",
              d: "Drive Safe and Red Alerts warn road users until resolved or expired.",
            },
          ].map((s, idx) => (
            <div key={s.t} className="card-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-safe-soft text-safe">
                  <s.i className="size-5" />
                </span>
                <span className="font-display text-3xl font-extrabold text-border">0{idx + 1}</span>
              </div>
              <h3 className="mt-3 font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title={"RoadGuard – Know the Risk. Drive Safe."}
        description="Explore accident-prone locations, risk levels and verified road alerts around Jaysingpur, Sangli, Miraj and Ichalkaranji."
      />
      <HomeContent />
    </>
  );
}
