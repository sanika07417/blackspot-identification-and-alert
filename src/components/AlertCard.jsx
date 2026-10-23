import { Link } from "react-router-dom";
import { BadgeCheck, Clock, MapPin, Siren, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

import { Pill, StatusBadge, fmt } from "./kit";

export function AlertTypeBadge({ type }) {
  return type === "RED_ALERT" ? (
    <Pill className="border-danger bg-danger text-destructive-foreground">
      <Siren className="size-3" />
      Red Alert
    </Pill>
  ) : (
    <Pill className="border-caution bg-caution text-navy">
      <TriangleAlert className="size-3" />
      Drive Safe
    </Pill>
  );
}

export function AlertCard({ alert: a }) {
  const inactive = a.status !== "ACTIVE";
  return (
    <Link
      to={`/alerts/${a.id}`}
      className={cn(
        "card-surface group flex flex-col overflow-hidden transition hover:-translate-y-0.5",
        inactive && "opacity-70",
      )}
    >
      <div
        className={cn(
          "h-1.5",
          a.type === "RED_ALERT" ? "bg-danger" : "bg-caution",
          inactive && "bg-muted-foreground",
        )}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <AlertTypeBadge type={a.type} />
          <Pill className="border-border bg-secondary text-secondary-foreground">{a.category}</Pill>
          {inactive && <StatusBadge status={a.status} />}
        </div>
        <h3 className="font-bold leading-snug group-hover:text-safe">{a.title}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {a.location}, {a.area}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            Reported {fmt(a.reportedAt)}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-safe">
            <BadgeCheck className="size-3.5" />
            {a.verified ? "Verified" : "Unverified"} · {a.source}
          </span>
          <span>
            Severity: <b className="text-foreground">{a.severity}</b> · Updated {fmt(a.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
