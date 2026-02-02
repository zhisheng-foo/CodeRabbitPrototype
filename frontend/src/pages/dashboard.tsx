import { useEffect, useMemo, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ConnectionCard } from "@/components/dashboard/ConnectionCard";
import { ForecastTableCard } from "@/components/dashboard/ForecastTableCard";
import type { Status, WeatherForecast } from "@/components/dashboard/types";
import { fetchWeatherForecast } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState<WeatherForecast[] | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setStatus("loading");
    setError(null);

    try {
      const json = await fetchWeatherForecast();
      setData(json);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message ?? "Unknown error");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    if (!data?.length) return null;
    const avgC = data.reduce((acc, x) => acc + x.temperatureC, 0) / data.length;
    const minC = Math.min(...data.map((x) => x.temperatureC));
    const maxC = Math.max(...data.map((x) => x.temperatureC));
    return { count: data.length, avgC: avgC.toFixed(1), minC, maxC };
  }, [data]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="h-screen w-full px-10 py-10">
        <div className="mx-auto w-full max-w-screen-2xl space-y-10">
          <div className="mb-10">
            <DashboardHeader status={status} onRefresh={refresh} />
          </div>

          <div className="space-y-6">
            <ConnectionCard status={status} error={error} stats={stats} />
            <ForecastTableCard status={status} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
