import { useState } from "react";
import { CheckCircle2, FileUp, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { selectCls } from "./kit";
import { REGION } from "@/lib/validation";

const TARGETS = [
  "datetime",
  "location",
  "lat",
  "lng",
  "injuries",
  "fatalities",
  "severity",
  "(ignore)",
];

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const split = (l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
  return { headers: split(lines[0] ?? ""), rows: lines.slice(1).map(split) };
}

const SAMPLE_CSV = `Date Time,Place,Latitude,Longitude,Injured,Killed,Severity
2024-03-14 21:10,Udgaon Bridge,16.8011,74.6010,2,1,Fatal
2024-03-20 08:30,Jaysingpur Bus Stand,16.7791,74.5561,1,0,Minor
2024-04-02 19:45,Vishrambag Chowk,16.8437,74.6030,3,0,Grievous
2024-04-02 19:45,Vishrambag Chowk,16.8437,74.6030,3,0,Grievous
2024-13-40 25:00,Miraj ROB,16.8215,74.6492,1,0,Minor
2024-05-11 14:00,Unknown,19.0760,72.8777,0,0,Damage only`;

export function CsvImporter() {
  const [data, setData] = useState(null);
  const [map, setMap] = useState({});
  const [summary, setSummary] = useState(null);

  const load = (text) => {
    const p = parseCsv(text);
    setData(p);
    setSummary(null);
    const guess = {};
    p.headers.forEach((h, i) => {
      const k = h.toLowerCase();
      guess[i] = k.includes("date")
        ? "datetime"
        : k.includes("lat")
          ? "lat"
          : k.includes("lon") || k.includes("lng")
            ? "lng"
            : k.includes("place") || k.includes("loc")
              ? "location"
              : k.includes("injur")
                ? "injuries"
                : k.includes("kill") || k.includes("fatal")
                  ? "fatalities"
                  : k.includes("sever")
                    ? "severity"
                    : "(ignore)";
    });
    setMap(guess);
  };

  const validate = () => {
    if (!data) return;
    const col = (name) => Number(Object.entries(map).find(([, v]) => v === name)?.[0] ?? -1);
    const [dI, laI, lnI] = [col("datetime"), col("lat"), col("lng")];
    if (dI < 0 || laI < 0 || lnI < 0) {
      toast.error("Map date/time, latitude and longitude columns first.");
      return;
    }
    const seen = new Set();
    const invalid = [];
    let ok = 0,
      dup = 0;
    data.rows.forEach((r, i) => {
      const rawD = r[dI] ?? "",
        rawLat = r[laI] ?? "",
        rawLng = r[lnI] ?? "";
      const lat = +rawLat,
        lng = +rawLng,
        d = new Date(rawD.replace(" ", "T"));
      if (isNaN(d.getTime())) {
        invalid.push({ row: i + 2, reason: `Invalid date "${rawD}"` });
        return;
      }
      if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat < REGION.minLat ||
        lat > REGION.maxLat ||
        lng < REGION.minLng ||
        lng > REGION.maxLng
      ) {
        invalid.push({ row: i + 2, reason: `Coordinates outside region (${rawLat}, ${rawLng})` });
        return;
      }
      const key = `${rawD}|${lat}|${lng}`;
      if (seen.has(key)) {
        dup++;
        return;
      }
      seen.add(key);
      ok++;
    });
    setSummary({ ok, invalid, dup });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm hover:bg-secondary">
          <FileUp className="size-4" />
          Upload CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) load(await f.text());
            }}
          />
        </label>
        <Button variant="ghost" onClick={() => load(SAMPLE_CSV)}>
          Load sample CSV
        </Button>
      </div>
      {data && (
        <>
          <div>
            <h3 className="mb-2 text-sm font-bold">1. Column mapping</h3>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {data.headers.map((h, i) => (
                <label key={i} className="text-xs">
                  <span className="mb-1 block font-medium">{h}</span>
                  <select
                    className={selectCls}
                    value={map[i]}
                    onChange={(e) => setMap({ ...map, [i]: e.target.value })}
                  >
                    {TARGETS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold">2. Preview ({data.rows.length} rows)</h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted">
                  <tr>
                    {data.headers.map((h) => (
                      <th key={h} className="px-3 py-2 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.slice(0, 8).map((r, i) => (
                    <tr key={i} className="border-t">
                      {r.map((c, j) => (
                        <td key={j} className="px-3 py-1.5">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Button onClick={validate}>3. Validate & check duplicates</Button>
        </>
      )}
      {summary && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-md bg-safe-soft p-2">
              <p className="text-xl font-bold text-safe">{summary.ok}</p>Valid
            </div>
            <div className="rounded-md bg-danger-soft p-2">
              <p className="text-xl font-bold text-danger">{summary.invalid.length}</p>Invalid
            </div>
            <div className="rounded-md bg-caution-soft p-2">
              <p className="text-xl font-bold">{summary.dup}</p>Duplicates
            </div>
          </div>
          {summary.invalid.length > 0 && (
            <ul className="space-y-1 text-xs">
              {summary.invalid.map((x) => (
                <li key={x.row} className="flex gap-2 text-danger">
                  <TriangleAlert className="size-3.5" />
                  Row {x.row}: {x.reason}
                </li>
              ))}
            </ul>
          )}
          <Button
            variant="safe"
            disabled={!summary.ok}
            onClick={() =>
              toast.success(
                `Imported ${summary.ok} records. ${summary.invalid.length} invalid and ${summary.dup} duplicate rows skipped.`,
              )
            }
          >
            <CheckCircle2 />
            Import {summary.ok} valid rows
          </Button>
        </div>
      )}
    </div>
  );
}
