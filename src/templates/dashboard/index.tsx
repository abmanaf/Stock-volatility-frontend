"use client";

import Link from "next/link";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Clock,
  TrendingUp,
  XCircle,
  Zap,
} from "@/atoms/icon";
import { PageHeader } from "@/organisms/page-header";
import { StatCard } from "@/molecules/stat-card";
import { QuickActionCard } from "@/molecules/quick-action-card";
import { EmptyState } from "@/molecules/empty-state";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { format } from "date-fns";

export function DashboardTemplate() {
  const { fitHistory, predictHistory, lastFit, lastPrediction } = useAppStore();

  const successfulFits = fitHistory.filter((f) => f.success).length;
  const successfulPredictions = predictHistory.filter((p) => p.success).length;

  const recentActivity = [
    ...fitHistory.slice(0, 3).map((f) => ({ ...f, type: "fit" as const })),
    ...predictHistory
      .slice(0, 3)
      .map((p) => ({ ...p, type: "predict" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 6);

  const STATS_DATA = [
    {
      label: "Models Trained",
      value: fitHistory.length,
      subvalue: `${successfulFits} successful`,
      icon: BrainCircuit,
      iconColor: "text-[hsl(var(--cyan))]",
    },
    {
      label: "Forecasts Run",
      value: predictHistory.length,
      subvalue: `${successfulPredictions} successful`,
      icon: BarChart3,
      iconColor: "text-[hsl(var(--purple))]",
    },
    {
      label: "Last Ticker",
      value: lastFit?.ticker || lastPrediction?.ticker || "—",
      subvalue: lastFit ? "AIC/BIC logged" : "No model yet",
      icon: Activity,
      iconColor: "text-[hsl(var(--green))]",
      mono: true,
    },
    {
      label: "Last Horizon",
      value: lastPrediction ? `${lastPrediction.n_days}d` : "—",
      subvalue: lastPrediction
        ? format(new Date(lastPrediction.timestamp), "MMM d, HH:mm")
        : "No predictions yet",
      icon: Zap,
      iconColor: "text-[hsl(var(--amber))]",
      mono: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Dashboard"
        subtitle="GARCH Volatility and ARIMA Returns Forecasting"
      />
      <main className="flex-1 p-6 space-y-8">
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(195,100%,55%/0.2)] bg-gradient-to-br from-[hsl(222,47%,10%)] to-[hsl(222,47%,8%)] p-8 noise dot-grid animate-fade-up">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(195,100%,55%/0.06)] via-transparent to-[hsl(265,83%,68%/0.04)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 mb-2">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--green))] animate-pulse" />
                {/* <span className="mono text-[10px] uppercase tracking-widest text-[hsl(var(--green))]">System Online</span> */}
              </div>
              <h2 className="text-3xl font-semibold text-foreground leading-tight">
                Predict market volatility and
                <br />
                <span className="text-glow-cyan text-[hsl(var(--cyan))]">
                  returns
                </span>{" "}
                with GARCH and ARIMA
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Train GARCH(p,q) models on equity data and generate multi-day
                volatility forecasts powered by the{" "}
                <span className="mono">arch</span> library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="sm">
                <Link href="/fit">
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  Train Model
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/predict">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get Forecast
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-100">
          {STATS_DATA.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 animate-fade-up delay-200">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                  Recent Activity
                </p>
                <h3 className="text-sm font-semibold text-foreground mt-0.5">
                  Latest Operations
                </h3>
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            {recentActivity.length === 0 ? (
              <EmptyState
                message="No activity yet"
                hint="Train a model or run a forecast to see activity here."
              />
            ) : (
              <div className="divide-y divide-border">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.type === "fit" ? "bg-[hsl(195,100%,55%/0.1)]" : "bg-[hsl(265,83%,68%/0.1)]"}`}
                    >
                      {item.type === "fit" ? (
                        <BrainCircuit className="w-3.5 h-3.5 text-[hsl(var(--cyan))]" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 text-[hsl(var(--purple))]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="mono text-xs font-semibold text-foreground">
                          {item.ticker}
                        </span>
                        <span className="mono text-[10px] text-muted-foreground/60">
                          {item.type === "fit" ? "FIT" : "PREDICT"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.message ||
                          `${item.type === "predict" ? (item as { n_days: number }).n_days + "-day forecast" : "model trained"}`}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {item.success ? (
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--green))]" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div>
              <p className="mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Quick Actions
              </p>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Get Started
              </h3>
            </div>
            <div className="space-y-3">
              <QuickActionCard
                href="/fit"
                icon={BrainCircuit}
                iconBg="bg-[hsl(195,100%,55%/0.1)]"
                iconColor="text-[hsl(var(--cyan))]"
                title="Train a GARCH Model"
                description="Select a ticker, set observations and GARCH order (p, q), then fit your model."
                step="Step 1"
              />
              <QuickActionCard
                href="/predict"
                icon={TrendingUp}
                iconBg="bg-[hsl(265,83%,68%/0.1)]"
                iconColor="text-[hsl(var(--purple))]"
                title="Forecast Volatility"
                description="Load a trained model and generate a multi-day volatility forecast."
                step="Step 2"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
