import { Link } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, RiskBadge, SampleNotice } from "@/components/kit";
import { LazyMap } from "@/components/LazyMap";
import { BLACKSPOTS } from "@/lib/sample-data";
import { riskColor } from "@/lib/risk";

function AdminBlackspotsContent() {
  return (
    <>
      <PageHeader
        title="Black Spots"
        description="Hotspots generated from accident records. Not official designations unless confirmed by authorities."
        actions={
          <Button
            variant="outline"
            onClick={() => toast.success("Re-analysis queued on the server.")}
          >
            <RefreshCw />
            Re-run analysis
          </Button>
        }
      />
      <SampleNotice className="mb-4" />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-surface h-[480px] overflow-hidden">
          <LazyMap
            points={BLACKSPOTS.map((b) => ({
              id: b.id,
              lat: b.lat,
              lng: b.lng,
              label: b.name,
              color: riskColor(b.risk),
              radius: 8 + b.accidents / 2.5,
            }))}
          />
        </div>
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                {["ID", "Name", "Accidents", "Score", "Risk", ""].map((h) => (
                  <th key={h} className="px-3 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLACKSPOTS.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{b.id}</td>
                  <td className="px-3 py-2">{b.name}</td>
                  <td className="px-3 py-2">{b.accidents}</td>
                  <td className="px-3 py-2 font-bold">{b.riskScore}</td>
                  <td className="px-3 py-2">
                    <RiskBadge risk={b.risk} />
                  </td>
                  <td className="px-3 py-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/blackspots/${b.id}`}>Open</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminBlackspots() {
  return (
    <>
      <AdminBlackspotsContent />
    </>
  );
}
