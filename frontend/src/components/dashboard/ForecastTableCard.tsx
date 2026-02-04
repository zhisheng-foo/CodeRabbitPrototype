import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Status, WeatherForecastItem } from "./types";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

type Props = {
  status: Status;
  data: WeatherForecastItem[] | null;
  unit: "c" | "f";
};

export function ForecastTableCard({ status, data, unit }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <CardTitle className="text-base">Forecast Table</CardTitle>
          <CardDescription>
            {status === "loading" ? "Loading..." : data?.length ? `${data.length} rows` : "No data yet"}
          </CardDescription>
        </div>
        <div className="rounded-full border bg-muted/40 px-3 py-1 text-xs uppercase text-muted-foreground">
          Unit {unit}
        </div>
      </CardHeader>

      <CardContent>
        {status === "loading" && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {status === "success" && data && data.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-right">{String.fromCharCode(176)}C</TableHead>
                  <TableHead className="text-right">{String.fromCharCode(176)}F</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell className="max-w-xs break-words">{row.summary ?? "N/A"}</TableCell>
                    <TableCell className="text-right font-medium">{row.temperatureC}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {row.temperatureF}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {status === "success" && (!data || data.length === 0) && (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No records returned for the current filters.
          </div>
        )}

        {status === "success" && data && data.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground">Show raw JSON</summary>
            <pre className="mt-2 overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

