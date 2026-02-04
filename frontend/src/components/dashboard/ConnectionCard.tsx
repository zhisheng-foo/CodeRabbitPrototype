import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import type { ForecastStats, Status } from "./types";

const DEGREE = String.fromCharCode(176);

type Props = {
  status: Status;
  error: string | null;
  stats: ForecastStats | null;
  generatedAt: string | null;
  unit: "c" | "f";
};

export function ConnectionCard({ status, error, stats, generatedAt, unit }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline Health</CardTitle>
        <CardDescription>Telemetry + quick stats for the forecast API</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="text-xs text-muted-foreground">Endpoint</div>
            <div className="mt-1 break-all font-medium">GET /api/weatherforecast</div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="text-xs text-muted-foreground">Unit</div>
            <div className="mt-1 font-medium uppercase">{unit}</div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <div className="text-xs text-muted-foreground">Generated</div>
            <div className="mt-1 font-medium">
              {generatedAt ? new Date(generatedAt).toLocaleTimeString() : "-"}
            </div>
          </div>
        </div>

        {status === "error" && error && (
          <Alert variant="destructive">
            <AlertTitle>Request failed</AlertTitle>
            <AlertDescription className="space-y-2 break-words">
              <div>{error}</div>
              <div className="text-xs opacity-90">
                If you're using the Vite proxy, confirm <code>vite.config.ts</code> targets
                <code> http://localhost:5149</code>.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {stats && status === "success" && (
          <>
            <Separator />
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Records</div>
                <div className="mt-1 text-lg font-semibold">{stats.count}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">{`Avg ${DEGREE}C`}</div>
                <div className="mt-1 text-lg font-semibold">{stats.avgC}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">{`Min ${DEGREE}C`}</div>
                <div className="mt-1 text-lg font-semibold">{stats.minC}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">{`Max ${DEGREE}C`}</div>
                <div className="mt-1 text-lg font-semibold">{stats.maxC}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

