"use client";

import { BrainCircuit } from "@/atoms/icon";
import type { LucideIcon } from "lucide-react";

interface InfoBannerProps {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export function InfoBanner({ icon: Icon = BrainCircuit, title, description }: InfoBannerProps) {
  return (
    <div className="rounded-xl border border-[hsl(195,100%,55%/0.2)] bg-[hsl(195,100%,55%/0.05)] p-4 flex gap-3 animate-fade-up">
      <Icon className="w-4 h-4 text-[hsl(var(--cyan))] shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}