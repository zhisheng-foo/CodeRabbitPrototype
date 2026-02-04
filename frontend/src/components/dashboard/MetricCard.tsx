import { Card, CardContent } from "@/components/ui/card";

type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: Props) {
  return (
    <Card className="border-0 bg-gradient-to-br from-muted/60 to-muted/20 shadow-sm">
      <CardContent className="space-y-1 p-4">
        <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
        <div className="text-2xl font-semibold tracking-tight text-foreground">{value}</div>
        {helper && <div className="text-xs text-muted-foreground">{helper}</div>}
      </CardContent>
    </Card>
  );
}
