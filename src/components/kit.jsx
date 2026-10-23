import { AlertTriangle, FlaskConical, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IS_SAMPLE } from "@/lib/api";

export const riskStyles = {
  LOW: "bg-safe-soft text-safe border-safe/30",
  MEDIUM: "bg-caution-soft text-navy border-caution/50",
  HIGH: "bg-danger-soft text-danger border-danger/30",
};
export const riskLabel = { LOW: "Lower risk", MEDIUM: "Medium risk", HIGH: "High risk" };

export function Pill({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ risk }) {
  return (
    <Pill className={riskStyles[risk]}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          risk === "HIGH" ? "bg-danger" : risk === "MEDIUM" ? "bg-caution" : "bg-safe",
        )}
      />
      {riskLabel[risk]}
    </Pill>
  );
}

const statusMap = {
  PENDING: "bg-caution-soft text-navy border-caution/50",
  VERIFIED: "bg-safe-soft text-safe border-safe/30",
  PUBLISHED: "bg-navy text-navy-foreground border-navy",
  ACTIVE: "bg-safe-soft text-safe border-safe/30",
  REJECTED: "bg-danger-soft text-danger border-danger/30",
  DUPLICATE: "bg-muted text-muted-foreground border-border",
  RESOLVED: "bg-muted text-muted-foreground border-border",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  DEACTIVATED: "bg-muted text-muted-foreground border-border",
  DISABLED: "bg-danger-soft text-danger border-danger/30",
  DRAFT: "bg-secondary text-secondary-foreground border-border",
};
export function StatusBadge({ status }) {
  return <Pill className={statusMap[status] ?? statusMap["DRAFT"]}>{status}</Pill>;
}

export function StatCard({ label, value, icon, tone = "navy", hint }) {
  const tones = {
    navy: "bg-navy text-navy-foreground",
    safe: "bg-safe text-accent-foreground",
    caution: "bg-caution text-navy",
    danger: "bg-danger text-destructive-foreground",
  };
  return (
    <div className="card-surface flex items-start gap-4 p-5">
      <div className={cn("grid size-11 shrink-0 place-items-center rounded-lg", tones[tone])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-bold">{value}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-safe">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function SampleNotice({ className }) {
  if (!IS_SAMPLE) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-caution/50 bg-caution-soft px-3 py-2 text-xs text-navy",
        className,
      )}
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0" />
      <span>
        <b>Sample data for design/demo.</b> Not real accident statistics or official black-spot
        designations. Connect the Spring Boot API to show live data.
      </span>
    </div>
  );
}

export function Loading({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      {label}
    </div>
  );
}
export function EmptyState({ title, text }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
      <Inbox className="size-8" />
      <p className="font-semibold text-foreground">{title}</p>
      {text && <p className="text-sm">{text}</p>}
    </div>
  );
}
export function ErrorState({ text = "Could not load data from the server." }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm text-danger">
      <AlertTriangle className="size-4" />
      {text}
    </div>
  );
}

export function Field({ label, error, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

export const selectCls =
  "h-9 w-full rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";

export function fmt(dt) {
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Container({ children, className }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}>{children}</div>;
}
