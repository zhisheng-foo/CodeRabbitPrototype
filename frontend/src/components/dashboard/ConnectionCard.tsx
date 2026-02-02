import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import type { Status } from "./types";

type Stats = {
  count: number;
  avgC: string;
  minC: number;
  maxC: number;
};

type Props = {
  status: Status;
  error: string | null;
  stats: Stats | null;
};

export function ConnectionCard({ status, error, stats }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Connection</CardTitle>
        <CardDescription>Health + quick stats for the API wiring</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Endpoint</div>
            <div className="mt-1 font-medium">GET /api/weatherforecast</div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Records</div>
            <div className="mt-1 font-medium">{stats?.count ?? "—"}</div>
          </div>
        </div>

        {status === "error" && error && (
          <Alert variant="destructive">
            <AlertTitle>Request failed</AlertTitle>
            <AlertDescription className="space-y-2">
              <div>{error}</div>
              <div className="text-xs opacity-90">
                If you’re using the Vite proxy, check <code>vite.config.ts</code> target is{" "}
                <code>http://localhost:5149</code>.
              </div>
            </AlertDescription>
          </Alert>
        )}

        {stats && status === "success" && (
          <>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Avg °C</div>
                <div className="mt-1 text-lg font-semibold">{stats.avgC}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Min °C</div>
                <div className="mt-1 text-lg font-semibold">{stats.minC}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Max °C</div>
                <div className="mt-1 text-lg font-semibold">{stats.maxC}</div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
