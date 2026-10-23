import { Seo } from "@/components/Seo";
import { useState } from "react";
import { Database, Map, Send, Server, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container, Field, PageHeader, selectCls } from "@/components/kit";

function AboutContent() {
  const [fb, setFb] = useState({ cat: "", msg: "", name: "", email: "" });
  const [err, setErr] = useState();
  return (
    <Container className="py-8">
      <PageHeader
        eyebrow="SIH26001"
        title="About RoadGuard"
        description="Black Spot Identification and Alert System — a software-only college project focused on accident-prone roads around Jaysingpur, Sangli, Miraj, Ichalkaranji and Kurundwad, Maharashtra."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card-surface p-6 lg:col-span-2">
          <h2 className="mb-3 text-lg font-bold">Problem & objectives</h2>
          <p className="text-muted-foreground">
            Road accidents repeatedly cluster at certain stretches. The problem statement asks for a
            system that identifies these accident-prone locations from data and alerts road users in
            time.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {[
              "Identify hotspots from historical accident records",
              "Visualise risk on an interactive map",
              "Let citizens report incidents for verification",
              "Publish verified Drive Safe / Red Alerts",
              "Give police/admins tools to manage data",
              "Keep historical, estimated and live data separate",
            ].map((o) => (
              <li key={o} className="flex gap-2 rounded-md bg-safe-soft p-2.5">
                <ShieldCheck className="size-4 shrink-0 text-safe" />
                {o}
              </li>
            ))}
          </ul>
          <h2 className="mt-8 mb-3 text-lg font-bold">System workflow</h2>
          <ol className="grid gap-2 text-sm sm:grid-cols-5">
            {[
              "CSV import & validation",
              "Hotspot clustering & scoring",
              "Citizen report → PENDING",
              "Reviewer verifies",
              "Alert published → expires/resolves",
            ].map((s, i) => (
              <li key={s} className="rounded-md border p-3">
                <span className="font-display text-xl font-extrabold text-caution">{i + 1}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
          <h2 className="mt-8 mb-3 text-lg font-bold">Architecture</h2>
          <div className="grid gap-3 sm:grid-cols-4 text-sm">
            {[
              { i: Smartphone, t: "React frontend", d: "Responsive UI, Leaflet maps, charts" },
              { i: Server, t: "Spring Boot API", d: "REST + Spring Security (JWT, roles)" },
              { i: Database, t: "MySQL", d: "Accidents, black spots, reports, alerts, users" },
              { i: Map, t: "OpenStreetMap", d: "Map tiles via Leaflet" },
            ].map((a) => (
              <div key={a.t} className="rounded-lg bg-muted p-3">
                <a.i className="mb-2 size-5 text-navy" />
                <p className="font-semibold">{a.t}</p>
                <p className="text-muted-foreground">{a.d}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-8 mb-3 text-lg font-bold">Data sources, scope & limitations</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Historical accident CSV dataset provided for the project; citizen and police reports.
            </li>
            <li>Risk scores are rule-based estimates, not official black-spot designations.</li>
            <li>No IoT/hardware; no AI predictions unless a real, evaluated model is added.</li>
            <li>Coverage limited to the listed areas; data quality depends on source records.</li>
          </ul>
        </section>
        <aside className="space-y-6">
          <section className="card-surface p-6">
            <h2 className="mb-2 text-lg font-bold">Help guide</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="m">
                <AccordionTrigger>Using the map</AccordionTrigger>
                <AccordionContent>
                  Search or filter by area, risk and year. Click a marker for details, then “View
                  Details”. Toggle heatmap to see density.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="c">
                <AccordionTrigger>Risk colours</AccordionTrigger>
                <AccordionContent>
                  <span className="text-safe font-semibold">Green</span> lower,{" "}
                  <span className="font-semibold">amber</span> medium,{" "}
                  <span className="text-danger font-semibold">red</span> high estimated risk.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="a">
                <AccordionTrigger>Alerts</AccordionTrigger>
                <AccordionContent>
                  Drive Safe = caution. Red Alert = urgent. Only verified alerts are public;
                  resolved/expired ones are greyed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="r">
                <AccordionTrigger>Reporting incidents</AccordionTrigger>
                <AccordionContent>
                  Fill the form, drop a pin, log in and submit. You get a report ID and can track it
                  in My Reports.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
          <section className="card-surface p-6">
            <h2 className="mb-3 text-lg font-bold">Feedback</h2>
            <form
              className="space-y-3"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (!fb.cat || fb.msg.trim().length < 10) {
                  setErr("Choose a category and write at least 10 characters.");
                  return;
                }
                setErr(undefined);
                toast.success("Thanks for your feedback!");
                setFb({ cat: "", msg: "", name: "", email: "" });
              }}
            >
              <Field label="Category">
                <select
                  className={selectCls}
                  value={fb.cat}
                  onChange={(e) => setFb({ ...fb, cat: e.target.value })}
                >
                  <option value="">Select…</option>
                  <option>Bug</option>
                  <option>Data correction</option>
                  <option>Suggestion</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Message">
                <Textarea
                  rows={3}
                  value={fb.msg}
                  onChange={(e) => setFb({ ...fb, msg: e.target.value })}
                />
              </Field>
              <Field label="Name (optional)">
                <Input value={fb.name} onChange={(e) => setFb({ ...fb, name: e.target.value })} />
              </Field>
              <Field label="Email (optional)">
                <Input
                  type="email"
                  value={fb.email}
                  onChange={(e) => setFb({ ...fb, email: e.target.value })}
                />
              </Field>
              {err && <p className="text-xs text-danger">{err}</p>}
              <Button type="submit" className="w-full">
                <Send />
                Send feedback
              </Button>
            </form>
          </section>
          <section id="privacy" className="card-surface p-6 text-sm text-muted-foreground">
            <h2 className="mb-2 text-lg font-bold text-foreground">Privacy</h2>
            We store only what's needed to verify reports (account email, report content, location).
            Reporter identities are never shown publicly. Passwords are hashed on the server and
            never displayed.
          </section>
        </aside>
      </div>
    </Container>
  );
}

export default function About() {
  return (
    <>
      <Seo
        title={"About, Help & Contact – RoadGuard"}
        description="About the SIH26001 Black Spot Identification and Alert System: objectives, architecture, data sources, help and feedback."
      />
      <AboutContent />
    </>
  );
}
