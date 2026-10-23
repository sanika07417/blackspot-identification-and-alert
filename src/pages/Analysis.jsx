import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
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
import { BrainCircuit, History, Gauge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Container,
  ErrorState,
  Field,
  Loading,
  PageHeader,
  RiskBadge,
  SampleNotice,
  selectCls,
} from "@/components/kit";
import { useApi } from "@/lib/api";
import { AREAS, BLACKSPOTS } from "@/lib/sample-data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SEV_COLORS = {
  Fatal: "var(--danger)",
  Grievous: "var(--caution)",
  Minor: "var(--chart-5)",
  "Damage only": "var(--safe)",
};

function AnalysisContent() {
  const { data, isLoading, isError } = useApi("/api/analytics/accidents");
  const [f, setF] = useState({
    start: "2020-01-01",
    end: "2024-12-31",
    area: "",
    severity: "",
    tod: "",
    weather: "",
  });
  const rows = useMemo(
    () =>
      (data ?? []).filter((r) => {
        const d = r.datetime.slice(0, 10);
        return (
          d >= f.start &&
          d <= f.end &&
          (!f.area || r.area === f.area) &&
          (!f.severity || r.severity === f.severity) &&
          (!f.tod || r.timeOfDay === f.tod) &&
          (!f.weather || r.weather === f.weather)
        );
      }),
    [data, f],
  );

  const count = (key, order) => {
    const m = new Map();
    order?.forEach((k) => m.set(k, 0));
    rows.forEach((r) => m.set(key(r), (m.get(key(r)) ?? 0) + 1));
    return [...m].map(([name, value]) => ({ name, value }));
  };
  const byMonth = count((r) => MONTHS[+r.datetime.slice(5, 7) - 1] ?? "", MONTHS);
  const byYear = count((r) => r.datetime.slice(0, 4), ["2020", "2021", "2022", "2023", "2024"]);
  const bySev = count((r) => r.severity, ["Fatal", "Grievous", "Minor", "Damage only"]);
  const byTod = count((r) => r.timeOfDay, ["Morning", "Afternoon", "Evening", "Night"]);
  const byLoc = count((r) => r.area).sort((a, b) => b.value - a.value);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <Container className="py-8">
      <PageHeader
        eyebrow="Analytics"
        title="Risk Analysis"
        description="Historical accident patterns are shown separately from the estimated current risk of each location."
      />
      <SampleNotice className="mb-6" />
      <div className="card-surface mb-6 grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6">
        <Field label="Start date">
          <Input type="date" value={f.start} onChange={set("start")} />
        </Field>
        <Field label="End date">
          <Input type="date" value={f.end} onChange={set("end")} />
        </Field>
        <Field label="Area">
          <select className={selectCls} value={f.area} onChange={set("area")}>
            <option value="">All</option>
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Field>
        <Field label="Severity">
          <select className={selectCls} value={f.severity} onChange={set("severity")}>
            <option value="">All</option>
            {Object.keys(SEV_COLORS).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Time of day">
          <select className={selectCls} value={f.tod} onChange={set("tod")}>
            <option value="">All</option>
            {["Morning", "Afternoon", "Evening", "Night"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Weather">
          <select className={selectCls} value={f.weather} onChange={set("weather")}>
            <option value="">All</option>
            {["Clear", "Rain", "Fog"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <History className="size-5 text-safe" />
        Historical accident analysis{" "}
        <span className="text-sm font-normal text-muted-foreground">({rows.length} records)</span>
      </h2>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Accidents by month">
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Accidents" fill="var(--navy)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ChartCard title="Accidents by year">
            <LineChart data={byYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line dataKey="value" name="Accidents" stroke="var(--safe)" strokeWidth={3} />
            </LineChart>
          </ChartCard>
          <ChartCard title="By severity">
            <PieChart>
              <Pie
                data={bySev}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={95}
                label
              >
                {bySev.map((s) => (
                  <Cell key={s.name} fill={SEV_COLORS[s.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartCard>
          <ChartCard title="By time of day">
            <BarChart data={byTod}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="Accidents" fill="var(--caution)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ChartCard title="By location (area)" className="lg:col-span-2">
            <BarChart data={byLoc} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Bar dataKey="value" name="Accidents" fill="var(--danger)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ChartCard>
        </div>
      )}

      <h2 className="mt-10 mb-3 flex items-center gap-2 text-lg font-bold">
        <Gauge className="size-5 text-caution" />
        Current risk assessment — location comparison
      </h2>
      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
            <tr>
              {["Location", "Area", "Accidents", "Injuries", "Fatalities", "Score", "Risk", ""].map(
                (h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {[...BLACKSPOTS]
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((b) => (
                <tr key={b.id} className="border-t hover:bg-secondary/50">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3">{b.area}</td>
                  <td className="px-4 py-3">{b.accidents}</td>
                  <td className="px-4 py-3">{b.injuries}</td>
                  <td className="px-4 py-3">{b.fatalities}</td>
                  <td className="px-4 py-3 font-bold">{b.riskScore}</td>
                  <td className="px-4 py-3">
                    <RiskBadge risk={b.risk} />
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/blackspots/${b.id}`}>Select</Link>
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card-surface p-5">
          <h3 className="mb-2 font-bold">How the risk score is estimated</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Weighted accident count (fatal ×5, grievous ×3, minor ×1)</li>
            <li>Recent-year trend (rising trends add weight)</li>
            <li>Night-time and adverse-weather share</li>
            <li>Score 0–39 lower, 40–64 medium, 65+ high</li>
          </ul>
        </div>
        <div className="card-surface flex gap-3 p-5">
          <BrainCircuit className="size-8 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="font-bold">AI predictions</h3>
            <p className="text-sm text-muted-foreground">
              No evaluated machine-learning model is deployed, so no AI predictions are shown.
              Scores above are rule-based estimates from historical data.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`card-surface p-5 ${className}`}>
      <h3 className="mb-3 font-bold">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </div>
  );
}

export default function Analysis() {
  return (
    <>
      <Seo
        title={"Risk Analysis – RoadGuard"}
        description="Historical accident analytics by month, severity, time of day and location, plus current risk assessment."
      />
      <AnalysisContent />
    </>
  );
}
