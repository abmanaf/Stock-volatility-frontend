"use client";

import type { LucideIcon } from "lucide-react";

interface StatusRowProps {
  icon: LucideIcon;
  label: string;
  status: string;
  ok: boolean;
}

export function StatusRow({ icon: Icon, label, status, ok }: StatusRowProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-[hsl(var(--green))]" : "bg-destructive"} animate-pulse`} />
        <span className={`text-[10px] mono font-medium ${ok ? "text-[hsl(var(--green))]" : "text-destructive"}`}>{status}</span>
      </div>
    </div>
  );
}