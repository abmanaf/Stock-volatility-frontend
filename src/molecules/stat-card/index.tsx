"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
  mono?: boolean;
}

export function StatCard({
  label,
  value,
  subvalue,
  icon: Icon,
  iconColor = "text-[hsl(var(--cyan))]",
  className,
  mono = false,
}: StatCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-card p-5", className)}>
      <div className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[hsl(195,100%,55%/0.05)] blur-2xl" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="mono text-[10px] uppercase tracking-widest text-muted-foreground/70">{label}</p>
          <p className={cn("text-2xl font-semibold text-foreground leading-none", mono && "mono")}>{value}</p>
          {subvalue && <p className="text-xs text-muted-foreground">{subvalue}</p>}
        </div>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg border bg-card border-border shrink-0">
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
      </div>
    </div>
  );
}