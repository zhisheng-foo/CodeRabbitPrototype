export type WeatherForecastItem = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string | null;
};

export type WeatherForecastResponse = {
  generatedAt: string;
  unit: "c" | "f";
  items: WeatherForecastItem[];
};

export type ForecastStats = {
  count: number;
  avgC: number;
  minC: number;
  maxC: number;
  avgF: number;
  minF: number;
  maxF: number;
};

export type Status = "idle" | "loading" | "success" | "error";
