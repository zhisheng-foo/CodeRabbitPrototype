export type WeatherForecast = {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string | null;
};

export type Status = "idle" | "loading" | "success" | "error";