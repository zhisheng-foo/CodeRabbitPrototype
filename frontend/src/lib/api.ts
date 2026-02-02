import type { WeatherForecast } from "@/components/dashboard/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const WEATHERFORECAST_PATH = import.meta.env.VITE_WEATHERFORECAST_PATH ?? "/weatherforecast";

function joinUrl(base: string, path: string) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export async function fetchWeatherForecast(): Promise<WeatherForecast[]> {
  const url = joinUrl(API_BASE_URL, "/weatherforecast");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
