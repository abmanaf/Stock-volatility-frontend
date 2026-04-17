"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  ChevronRight,
  Flame,
  LayoutDashboard,
  TrendingUp,
  Zap,
} from "@/atoms/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { StatusRow } from "@/molecules/status-row";
import { useSystemStatus } from "@/hooks/useSystemStatus";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Train Model", href: "/fit", icon: BrainCircuit },
  { label: "Predict", href: "/predict", icon: TrendingUp },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { status, loading } = useSystemStatus();

  const getApiDisplayStatus = () => {
    if (!status) return "Offline";
    if (status.api.status === "online") {
      return `Online (${status.api.latency}ms)`;
    }
    return status.api.status;
  };

  const getModelDisplayStatus = () => {
    if (!status) return "No models";
    if (status.model.status === "ready") {
      return `${status.model.totalModels} model${status.model.totalModels !== 1 ? 's' : ''}`;
    }
    return status.model.status;
  };

  const getEngineDisplayStatus = () => {
    if (!status) return "Unknown";
    if (status.engine.status === "running") {
      return `${status.engine.currentModel || 'GARCH'}`;
    }
    return status.engine.status;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(195,100%,55%/0.15)] border border-[hsl(195,100%,55%/0.3)] glow-cyan">
            <Zap className="w-4 h-4 text-[hsl(var(--cyan))]" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              StockLab
            </p>
            <p className="text-[10px] text-muted-foreground mono uppercase tracking-widest">
              GARCH and ARIMA Engine
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? "bg-[hsl(195,100%,55%/0.1)] text-[hsl(var(--cyan))] border border-[hsl(195,100%,55%/0.2)]"
                          : ""
                      }
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                        {isActive && (
                          <ChevronRight className="ml-auto w-3 h-3 opacity-60" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupLabel className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Status
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2 group-data-[collapsible=icon]:hidden">
              <StatusRow
                icon={Activity}
                label="API"
                status={getApiDisplayStatus()}
                ok={status?.api.status === "online"}
                loading={loading}
              />

              <StatusRow
                icon={BarChart3}
                label="Model"
                status={getModelDisplayStatus()}
                ok={status?.model.status === "ready"}
                loading={loading}
                tooltip={
                  status?.model.lastTrained
                    ? `Last trained: ${new Date(status.model.lastTrained).toLocaleString()}`
                    : undefined
                }
              />
              <StatusRow 
                icon={Flame} 
                label="Engine" 
                status={getEngineDisplayStatus()} 
                ok={status?.engine.status === "running"}
                loading={loading}
                tooltip={status?.engine.status === "running"
                  ? `CPU: ${status.engine.cpu_usage}%\nMemory: ${status.engine.memory_usage}%\nVersion: ${status.engine.version}`
                  : undefined
                }
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="px-3 py-3 rounded-lg bg-[hsl(222,47%,13%)] border border-border">
          <p className="text-[10px] mono text-muted-foreground/60 uppercase tracking-widest mb-1">
            Powered by
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            AlphaVantage · FastAPI · arch
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
