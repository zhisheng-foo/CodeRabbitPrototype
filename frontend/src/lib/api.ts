import type { WeatherForecastResponse } from "@/components/dashboard/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const WEATHERFORECAST_PATH = import.meta.env.VITE_WEATHERFORECAST_PATH ?? "/weatherforecast";

const DEFAULT_TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 20000;

type FetchForecastOptions = {
  days?: number;
  unit?: "c" | "f";
  signal?: AbortSignal;
};

type CacheEntry<T> = {
  storedAt: number;
  data: T;
};

function joinUrl(base: string, path: string) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });
  return url.pathname + url.search;
}

function getCacheKey(url: string) {
  return `coderabbit.cache:${url}`;
}

function readCache<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - parsed.storedAt > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    const entry: CacheEntry<T> = { storedAt: Date.now(), data };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Ignore cache failures.
  }
}

async function fetchJson<T>(url: string, options: { signal?: AbortSignal; cacheTtlMs?: number }) {
  const cacheKey = getCacheKey(url);
  const cacheTtlMs = options.cacheTtlMs ?? CACHE_TTL_MS;
  const cached = readCache<T>(cacheKey, cacheTtlMs);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as T;
    writeCache(cacheKey, json);
    return json;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWeatherForecast({ days = 7, unit = "c", signal }: FetchForecastOptions = {}) {
  const url = buildUrl(joinUrl(API_BASE_URL, WEATHERFORECAST_PATH), { days, unit });
  return fetchJson<WeatherForecastResponse>(url, { signal, cacheTtlMs: CACHE_TTL_MS });
}
