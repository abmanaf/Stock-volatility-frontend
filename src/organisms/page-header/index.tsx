import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, badge, children, className }: PageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4", className)}>
      <SidebarTrigger className="shrink-0 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
            {badge && <span className="mono text-[9px] font-medium uppercase tracking-widest px-1.5 py-0.5 rounded bg-[hsl(195,100%,55%/0.1)] text-[hsl(var(--cyan))] border border-[hsl(195,100%,55%/0.2)] shrink-0">{badge}</span>}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">{children}</div>
      </div>
    </header>
  );
}