interface MetricBoxProps {
  label: string;
  value: string;
}

export function MetricBox({ label, value }: MetricBoxProps) {
  return (
    <div className="rounded-lg border border-border bg-card/60 px-4 py-3">
      <p className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <p className="mono text-xl font-semibold text-[hsl(var(--cyan))]">{value}</p>
    </div>
  );
}