import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Flame, MapPin, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ErrorState, Loading, RiskBadge, SampleNotice, selectCls } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { useApi } from "@/lib/api";
import { AREAS } from "@/lib/sample-data";
import { riskColor } from "@/lib/risk";

function MapPageContent() {
  const { data, isLoading, isError } = useApi("/api/blackspots");
  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [risk, setRisk] = useState("");
  const [year, setYear] = useState("");
  const [heat, setHeat] = useState(false);
  const [sel, setSel] = useState(null);

  const list = useMemo(
    () =>
      (data ?? []).filter(
        (b) =>
          (!q || `${b.name} ${b.area} ${b.road}`.toLowerCase().includes(q.toLowerCase())) &&
          (!area || b.area === area) &&
          (!risk || b.risk === risk) &&
          (!year || b.yearly.some((y) => y.year === +year && y.accidents > 0)),
      ),
    [data, q, area, risk, year],
  );
  const selected = list.find((b) => b.id === sel) ?? null;
  const reset = () => {
    setQ("");
    setArea("");
    setRisk("");
    setYear("");
    setSel(null);
    setHeat(false);
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-4rem)] lg:flex-row">
      <aside className="flex w-full flex-col border-b bg-card lg:w-96 lg:border-r lg:border-b-0">
        <div className="space-y-3 border-b p-4">
          <h1 className="text-xl font-bold">Black Spots Map</h1>
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search location or road…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <select
              className={selectCls}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              aria-label="Area"
            >
              <option value="">All areas</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select
              className={selectCls}
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              aria-label="Risk"
            >
              <option value="">Any risk</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Lower</option>
            </select>
            <select
              className={selectCls}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Year"
            >
              <option value="">All years</option>
              {[2020, 2021, 2022, 2023, 2024].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={heat} onCheckedChange={setHeat} />
              <Flame className="size-4 text-danger" />
              Heatmap
            </label>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw />
              Reset Filters
            </Button>
          </div>
          <SampleNotice />
        </div>
        <div className="max-h-72 flex-1 overflow-y-auto lg:max-h-none">
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <div className="p-4">
              <ErrorState />
            </div>
          ) : list.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No locations match these filters.
            </p>
          ) : (
            list.map((b) => (
              <button
                key={b.id}
                onClick={() => setSel(b.id)}
                className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left hover:bg-secondary ${sel === b.id ? "bg-secondary" : ""}`}
              >
                <MapPin
                  className={`mt-0.5 size-4 shrink-0 ${b.risk === "HIGH" ? "text-danger" : b.risk === "MEDIUM" ? "text-caution" : "text-safe"}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{b.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {b.area} · {b.accidents} accidents
                  </span>
                </span>
                <RiskBadge risk={b.risk} />
              </button>
            ))
          )}
        </div>
      </aside>
      <div className="relative h-[70vh] flex-1 lg:h-auto">
        <LazyMap
          points={list.map((b) => ({
            id: b.id,
            lat: b.lat,
            lng: b.lng,
            label: b.name,
            sub: `${b.accidents} accidents`,
            color: riskColor(b.risk),
            radius: 8 + b.accidents / 2.5,
          }))}
          heat={heat}
          onSelect={setSel}
          selectedId={sel}
          center={selected ? [selected.lat, selected.lng] : [16.77, 74.55]}
          zoom={selected ? 14 : 11}
        />
        <div className="absolute bottom-4 left-4 z-[400] rounded-lg bg-card/95 p-3 text-xs shadow-lg">
          <p className="mb-1.5 font-semibold">Risk level</p>
          <div className="space-y-1">
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-danger" />
              High
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-caution" />
              Medium
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-safe" />
              Lower
            </p>
          </div>
        </div>
        {selected && (
          <div className="absolute top-4 right-4 z-[400] w-[min(22rem,calc(100%-2rem))] card-surface p-5">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setSel(null)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <RiskBadge risk={selected.risk} />
            <h2 className="mt-2 pr-6 text-lg font-bold">{selected.name}</h2>
            <p className="text-sm text-muted-foreground">
              {selected.road}, {selected.area}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Latitude</dt>
                <dd className="font-mono">{selected.lat}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Longitude</dt>
                <dd className="font-mono">{selected.lng}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Accidents</dt>
                <dd className="text-lg font-bold">{selected.accidents}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Injuries</dt>
                <dd className="text-lg font-bold">{selected.injuries}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Fatalities</dt>
                <dd className="text-lg font-bold text-danger">{selected.fatalities}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Risk score</dt>
                <dd className="text-lg font-bold">{selected.riskScore}/100</dd>
              </div>
            </dl>
            <Button className="mt-4 w-full" asChild>
              <Link to={`/blackspots/${selected.id}`}>View Details</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <>
      <Seo
        title={"Black Spots Map – RoadGuard"}
        description="Interactive OpenStreetMap of accident-prone locations with risk filters and heatmap."
      />
      <MapPageContent />
    </>
  );
}
