import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Status } from "./types";

type Props = {
  status: Status;
  onRefresh: () => void;
  lastUpdatedLabel: string | null;
};

export function DashboardHeader({ status, onRefresh, lastUpdatedLabel }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 px-6 py-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">CodeRabbit Prototype</p>
        <h1 className="text-2xl font-semibold tracking-tight">API Observability Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Live telemetry for the forecast pipeline - React + .NET Minimal API
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          {lastUpdatedLabel ? `Updated ${lastUpdatedLabel}` : "Waiting for data"}
        </div>
        <StatusBadge status={status} />
        <Button onClick={onRefresh} disabled={status === "loading"}>
          {status === "loading" ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}

