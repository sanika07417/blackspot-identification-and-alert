import { Seo } from "@/components/Seo";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Crosshair, ImagePlus, Lock, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container, Field, PageHeader, selectCls } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { apiSend } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { BLACKSPOTS, CATEGORIES } from "@/lib/sample-data";
import { buildReportPayload, validateReport } from "@/lib/validation";

const DRAFT_KEY = "roadguard.reportDraft";
const empty = {
  category: "",
  title: "",
  location: "",
  lat: "",
  lng: "",
  datetime: "",
  description: "",
};

function ReportContent() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [d, setD] = useState(empty);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) setD(JSON.parse(raw));
  }, []);
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));

  const searchLocation = () => {
    const hit = BLACKSPOTS.find((b) =>
      `${b.name} ${b.area}`.toLowerCase().includes(d.location.toLowerCase()),
    );
    if (hit) setD((p) => ({ ...p, lat: String(hit.lat), lng: String(hit.lng) }));
  };

  async function submit(e) {
    e.preventDefault();
    const errs = validateReport(d);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (!user) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
      navigate("/login?redirect=" + encodeURIComponent("/report"));
      return;
    }
    setBusy(true);
    await apiSend("/api/reports", "POST", buildReportPayload(d));
    setBusy(false);
    sessionStorage.removeItem(DRAFT_KEY);
    setDone(`RPT-${Date.now().toString().slice(-6)}`);
  }

  if (done)
    return (
      <Container className="py-16">
        <div className="card-surface mx-auto max-w-lg p-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-safe" />
          <h1 className="mt-4 text-2xl font-bold">Report submitted</h1>
          <p className="mt-2 text-muted-foreground">Your report ID is</p>
          <p className="mt-1 font-mono text-2xl font-bold">{done}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Status: <b>PENDING</b>. A police reviewer will verify it before any public alert is
            published.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild>
              <Link to="/dashboard">Go to My Reports</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDone(null);
                setD(empty);
              }}
            >
              Report another
            </Button>
          </div>
        </div>
      </Container>
    );

  const pin = d.lat && d.lng && !isNaN(+d.lat) && !isNaN(+d.lng) ? [+d.lat, +d.lng] : null;

  return (
    <Container className="py-8">
      <PageHeader
        eyebrow="Citizen reporting"
        title="Report an Incident"
        description="Help others stay safe. Reports are reviewed by authorized police reviewers before anything is published."
      />
      {ready && !user && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border bg-secondary p-3 text-sm">
          <Lock className="size-4" />
          You can fill the form now — you'll be asked to log in before final submission. Your
          entries will be kept.
        </div>
      )}
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface space-y-4 p-6">
          <Field label="Incident category *" error={errors.category}>
            <select
              className={selectCls}
              value={d.category}
              onChange={(e) => set("category", e.target.value)}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Title *" error={errors.title}>
            <Input
              value={d.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Truck breakdown blocking lane"
            />
          </Field>
          <Field
            label="Location *"
            error={errors.location}
            hint="Search a known place or click the map to drop a pin."
          >
            <div className="flex gap-2">
              <Input
                value={d.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Udgaon bridge"
              />
              <Button type="button" variant="outline" onClick={searchLocation}>
                <Search />
                Find
              </Button>
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude *" error={errors.lat}>
              <Input
                value={d.lat}
                onChange={(e) => set("lat", e.target.value)}
                placeholder="16.7790"
              />
            </Field>
            <Field label="Longitude *" error={errors.lng}>
              <Input
                value={d.lng}
                onChange={(e) => set("lng", e.target.value)}
                placeholder="74.5560"
              />
            </Field>
          </div>
          <Field label="Incident date & time *" error={errors.datetime}>
            <Input
              type="datetime-local"
              value={d.datetime}
              onChange={(e) => set("datetime", e.target.value)}
            />
          </Field>
          <Field label="Description *" error={errors.description}>
            <Textarea
              rows={4}
              value={d.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What happened? Lanes affected? Anyone injured?"
            />
          </Field>
          <Field label="Photo (optional)" hint="JPG/PNG up to 5 MB.">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-secondary">
              <ImagePlus className="size-4" />
              {photo ? photo.name : "Choose a photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
          </Field>
          <Button type="submit" variant="safe" size="lg" className="w-full" disabled={busy}>
            <Send />
            {busy ? "Submitting…" : user ? "Submit report" : "Log in & submit"}
          </Button>
        </div>
        <div className="card-surface flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b p-3 text-sm">
            <Crosshair className="size-4 text-danger" />
            Click on the map to set the incident pin
          </div>
          <div className="h-[420px] flex-1 lg:h-auto">
            <LazyMap
              pin={pin}
              center={pin ?? [16.77, 74.55]}
              zoom={pin ? 14 : 11}
              onPick={(lat, lng) => setD((p) => ({ ...p, lat: String(lat), lng: String(lng) }))}
            />
          </div>
        </div>
      </form>
    </Container>
  );
}

export default function Report() {
  return (
    <>
      <Seo
        title={"Report an Incident – RoadGuard"}
        description="Report road accidents, blockages, construction, fallen trees or waterlogging for verification."
      />
      <ReportContent />
    </>
  );
}
