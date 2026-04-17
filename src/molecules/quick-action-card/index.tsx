"use client";

import Link from "next/link";
import { ArrowRight } from "@/atoms/icon";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  step: string;
}

export function QuickActionCard({
  href,
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  step,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 hover:border-[hsl(195,100%,55%/0.2)] transition-all"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="mono text-[9px] uppercase tracking-widest text-muted-foreground/50">{step}</span>
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
    </Link>
  );
}