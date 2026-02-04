import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Status } from "./types";

type Props = {
  days: number;
  unit: "c" | "f";
  autoRefresh: boolean;
  status: Status;
  onDaysChange: (days: number) => void;
  onUnitChange: (unit: "c" | "f") => void;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
};

const DEGREE = String.fromCharCode(176);

export function FiltersBar({
  days,
  unit,
  autoRefresh,
  status,
  onDaysChange,
  onUnitChange,
  onToggleAutoRefresh,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">Forecast days</div>
          <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            {days} days
          </div>
        </div>
        <input
          type="range"
          min={3}
          max={14}
          value={days}
          onChange={(event) => onDaysChange(Number(event.target.value))}
          className="h-2 w-full max-w-xs cursor-pointer appearance-none rounded-full bg-muted"
        />
        <Separator className="hidden h-6 md:block" orientation="vertical" />
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Units</div>
          <div className="flex rounded-full border bg-muted/30 p-1">
            <button
              onClick={() => onUnitChange("c")}
              className={`rounded-full px-3 py-1 text-xs uppercase transition ${
                unit === "c" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {`${DEGREE}C`}
            </button>
            <button
              onClick={() => onUnitChange("f")}
              className={`rounded-full px-3 py-1 text-xs uppercase transition ${
                unit === "f" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {`${DEGREE}F`}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToggleAutoRefresh}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${
            autoRefresh ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          Auto {autoRefresh ? "On" : "Off"}
        </button>
        <Button variant="secondary" onClick={onRefresh} disabled={status === "loading"}>
          Run Update
        </Button>
      </div>
    </div>
  );
}

