import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConnectionCard } from "@/components/dashboard/ConnectionCard";
import { ForecastTableCard } from "@/components/dashboard/ForecastTableCard";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ForecastChart } from "@/components/dashboard/ForecastChart";
import type { ForecastStats, Status, WeatherForecastResponse } from "@/components/dashboard/types";
import { fetchWeatherForecast } from "@/lib/api";

const AUTO_REFRESH_MS = 30000;
const DEGREE = String.fromCharCode(176);

function computeStats(items: WeatherForecastResponse["items"]): ForecastStats {
  if (!items.length) {
    return { count: 0, avgC: 0, minC: 0, maxC: 0, avgF: 0, minF: 0, maxF: 0 };
  }

  const count = items.length;
  const avgC = Number((items.reduce((acc, x) => acc + x.temperatureC, 0) / count).toFixed(1));
  const avgF = Number((items.reduce((acc, x) => acc + x.temperatureF, 0) / count).toFixed(1));
  const minC = Math.min(...items.map((x) => x.temperatureC));
  const maxC = Math.max(...items.map((x) => x.temperatureC));
  const minF = Math.min(...items.map((x) => x.temperatureF));
  const maxF = Math.max(...items.map((x) => x.temperatureF));

  return { count, avgC, minC, maxC, avgF, minF, maxF };
}

function formatRelativeTime(iso: string | null) {
  if (!iso) return null;
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return null;
  const diff = Date.now() - ts;
  const seconds = Math.max(0, Math.round(diff / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

export default function Dashboard() {
  const [data, setData] = useState<WeatherForecastResponse | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [unit, setUnit] = useState<"c" | "f">("c");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const json = await fetchWeatherForecast({ days, unit });
      setData(json);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Unknown error");
    }
  }, [days, unit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => refresh(), AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [autoRefresh, refresh]);

  const stats = useMemo(() => {
    if (!data?.items?.length) return null;
    return computeStats(data.items);
  }, [data]);

  const lastUpdatedLabel = useMemo(() => formatRelativeTime(data?.generatedAt ?? null), [data]);
  const avgValue = stats ? (unit === "c" ? stats.avgC : stats.avgF) : null;
  const minValue = stats ? (unit === "c" ? stats.minC : stats.minF) : null;
  const maxValue = stats ? (unit === "c" ? stats.maxC : stats.maxF) : null;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="relative mx-auto w-full max-w-screen-2xl space-y-8 px-6 py-10">
        <DashboardHeader status={status} onRefresh={refresh} lastUpdatedLabel={lastUpdatedLabel} />

        <FiltersBar
          days={days}
          unit={unit}
          autoRefresh={autoRefresh}
          status={status}
          onDaysChange={setDays}
          onUnitChange={setUnit}
          onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
          onRefresh={refresh}
        />

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="Avg temp"
                value={avgValue !== null ? `${avgValue} ${DEGREE}${unit.toUpperCase()}` : "-"}
                helper="Rolling mean"
              />
              <MetricCard
                label="Min temp"
                value={minValue !== null ? `${minValue} ${DEGREE}${unit.toUpperCase()}` : "-"}
                helper="Lowest point"
              />
              <MetricCard
                label="Max temp"
                value={maxValue !== null ? `${maxValue} ${DEGREE}${unit.toUpperCase()}` : "-"}
                helper="Highest point"
              />
            </div>
            {data?.items?.length ? <ForecastChart items={data.items} unit={unit} /> : null}
          </div>
          <ConnectionCard
            status={status}
            error={error}
            stats={stats}
            generatedAt={data?.generatedAt ?? null}
            unit={unit}
          />
        </div>

        <ForecastTableCard status={status} data={data?.items ?? null} unit={unit} />
      </div>
    </div>
  );
}

