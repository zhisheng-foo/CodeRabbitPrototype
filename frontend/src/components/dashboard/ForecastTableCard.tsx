import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Status, WeatherForecast } from "./types";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

type Props = {
  status: Status;
  data: WeatherForecast[] | null;
};

export function ForecastTableCard({ status, data }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">WeatherForecast</CardTitle>
          <CardDescription>
            {status === "loading"
              ? "Loading..."
              : data?.length
              ? `${data.length} rows`
              : "No data yet"}
          </CardDescription>
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

        {status === "success" && data && (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="text-right">°C</TableHead>
                  <TableHead className="text-right">°F</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.summary ?? "—"}</TableCell>
                    <TableCell className="text-right">{row.temperatureC}</TableCell>
                    <TableCell className="text-right">{row.temperatureF}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {status === "success" && data && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-muted-foreground">Show raw JSON</summary>
            <pre className="mt-2 rounded-lg border bg-muted p-3 text-xs overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
