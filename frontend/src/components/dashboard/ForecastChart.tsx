import type { WeatherForecastItem } from "./types";

type Props = {
  items: WeatherForecastItem[];
  unit: "c" | "f";
};

const DEGREE = String.fromCharCode(176);

export function ForecastChart({ items, unit }: Props) {
  const values = items.map((item) => (unit === "c" ? item.temperatureC : item.temperatureF));
  const max = Math.max(...values, 1);

  return (
    <div className="rounded-xl border bg-card/40 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Trend</div>
          <div className="text-base font-semibold">Next {items.length} days</div>
        </div>
        <div className="text-xs uppercase text-muted-foreground">{`${DEGREE}${unit}`}</div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${items.length * 28} 120`} className="h-32 w-full">
          {values.map((value, index) => {
            const height = Math.max(8, Math.round((value / max) * 90));
            const x = index * 28 + 6;
            const y = 100 - height;
            return (
              <g key={items[index].date}>
                <rect
                  x={x}
                  y={y}
                  width="16"
                  height={height}
                  rx="6"
                  className="fill-primary/80"
                />
                <text x={x + 8} y={112} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

