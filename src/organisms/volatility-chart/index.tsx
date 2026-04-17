"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

interface VolatilityChartProps {
  forecast: Record<string, number>;
  ticker: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
        <p className="mono text-sm font-semibold text-[hsl(var(--cyan))]">σ = {payload[0].value.toFixed(4)}%</p>
      </div>
    );
  }
  return null;
};

export function VolatilityChart({ forecast, ticker }: VolatilityChartProps) {
  const data = Object.entries(forecast).map(([date, value]) => ({
    date: format(parseISO(date), "MMM d"),
    rawDate: date,
    volatility: Number(value.toFixed(4)),
  }));

  const max = Math.max(...data.map((d) => d.volatility));
  const min = Math.min(...data.map((d) => d.volatility));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60">Volatility Forecast</p>
          <h3 className="text-base font-semibold text-foreground mt-0.5">
            {ticker} <span className="text-muted-foreground font-normal text-sm">· {data.length}-day horizon</span>
          </h3>
        </div>
        <div className="flex gap-4 text-right">
          <div>
            <p className="mono text-[10px] text-muted-foreground/60 uppercase">Peak</p>
            <p className="mono text-sm font-semibold text-[hsl(var(--amber))]">{max.toFixed(3)}%</p>
          </div>
          <div>
            <p className="mono text-[10px] text-muted-foreground/60 uppercase">Floor</p>
            <p className="mono text-sm font-semibold text-[hsl(var(--green))]">{min.toFixed(3)}%</p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(195,100%,55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(195,100%,55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,47%,16%)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "hsl(213,20%,45%)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(213,20%,45%)", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v.toFixed(2)}%`} width={52} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="volatility" stroke="hsl(195,100%,55%)" strokeWidth={2} fill="url(#volGradient)" dot={{ fill: "hsl(195,100%,55%)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "hsl(195,100%,55%)", stroke: "hsl(222,47%,7%)", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border bg-muted/40">
          <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60 px-4 py-2">Date</div>
          <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60 px-4 py-2">Forecasted Volatility (σ)</div>
        </div>
        <div className="divide-y divide-border max-h-48 overflow-y-auto">
          {data.map((row) => (
            <div key={row.rawDate} className="grid grid-cols-2 divide-x divide-border hover:bg-muted/20 transition-colors">
              <div className="mono text-xs text-muted-foreground px-4 py-2.5">{row.date}</div>
              <div className="mono text-xs font-medium text-[hsl(var(--cyan))] px-4 py-2.5 flex items-center gap-2">
                <span className="inline-block h-1 rounded-full bg-[hsl(var(--cyan))]" style={{ width: `${((row.volatility - min) / (max - min || 1)) * 48 + 8}px` }} />
                {row.volatility.toFixed(4)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}