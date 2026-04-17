"use client";

import { AlertCircle, CheckCircle2, RefreshCw } from "@/atoms/icon";
import { Button } from "@/components/ui/button";
import { MetricBox } from "@/molecules/metric-box";
import { cn } from "@/lib/utils";
import type { FitResponse } from "@/lib/api";

interface ResultCardProps {
  result: FitResponse;
  onRetry: () => void;
}

export function ResultCard({ result, onRetry }: ResultCardProps) {
  const ok = result.success;
  const aicMatch = result.message.match(/AIC ([\d.-]+)/);
  const bicMatch = result.message.match(/BIC ([\d.-]+)/);
  const aic = aicMatch?.[1];
  const bic = bicMatch?.[1];

  return (
    <div className={cn("rounded-xl border p-5 space-y-4 animate-fade-up noise", ok ? "border-[hsl(142,71%,45%/0.3)] bg-[hsl(142,71%,45%/0.05)]" : "border-destructive/30 bg-destructive/5")}>
      <div className="flex items-center gap-3">
        {ok ? <CheckCircle2 className="w-5 h-5 text-[hsl(var(--green))] shrink-0" /> : <AlertCircle className="w-5 h-5 text-destructive shrink-0" />}
        <div>
          <p className="text-sm font-semibold text-foreground">{ok ? "Model Trained Successfully" : "Training Failed"}</p>
          <p className="text-xs text-muted-foreground mono">{result.ticker} · GARCH({result.p},{result.q})</p>
        </div>
        {!ok && <Button size="sm" variant="outline" onClick={onRetry} className="ml-auto"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Retry</Button>}
      </div>
      {ok && aic && bic && (
        <div className="grid grid-cols-2 gap-3">
          <MetricBox label="AIC" value={parseFloat(aic).toFixed(2)} />
          <MetricBox label="BIC" value={parseFloat(bic).toFixed(2)} />
        </div>
      )}
      <div className="rounded-lg bg-muted/30 border border-border px-4 py-3">
        <p className="mono text-xs text-muted-foreground break-words">{result.message}</p>
      </div>
    </div>
  );
}