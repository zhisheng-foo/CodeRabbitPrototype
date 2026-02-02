import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import type { Status } from "./types";

type Props = {
  status: Status;
  onRefresh: () => void;
};

export function DashboardHeader({ status, onRefresh }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card/40 px-6 py-4 backdrop-blur">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">Prototype Dashboard Testing</h1>
        <p className="text-sm text-muted-foreground">React (Vite) ⇄ .NET Minimal API</p>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <Button onClick={onRefresh} disabled={status === "loading"}>
          {status === "loading" ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
