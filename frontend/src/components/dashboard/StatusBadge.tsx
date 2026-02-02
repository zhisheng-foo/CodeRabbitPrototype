import { Badge } from "@/components/ui/badge";
import type { Status } from "./types";

export function StatusBadge({ status }: { status: Status }) {
  const cfg: Record<
    Status,
    { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
  > = {
    idle: { label: "Idle", variant: "outline" },
    loading: { label: "Loading", variant: "secondary" },
    success: { label: "Connected", variant: "secondary" }, // subtle looks nicer in dark mode
    error: { label: "Error", variant: "destructive" },
  };

  const s = cfg[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
