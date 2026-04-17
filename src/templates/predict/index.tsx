"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, TrendingUp } from "@/atoms/icon";
import { PageHeader } from "@/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { VolatilityChart } from "@/organisms/volatility-chart";
import { ErrorCard } from "@/organisms/error-card";
import { api, PredictResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { Label } from "@/components/ui/label";

interface FormValues {
  ticker: string;
  n_days: number;
}

export function PredictTemplate() {
  const addPredictResult = useAppStore((s) => s.addPredictResult);
  const lastFit = useAppStore((s) => s.lastFit);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { ticker: lastFit?.ticker || "AAPL", n_days: 5 },
  });

  const validateForm = (data: FormValues): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.ticker) errs.ticker = "Ticker is required";
    if (data.ticker.length > 10) errs.ticker = "Max 10 characters";
    if (data.n_days < 1) errs.n_days = "Minimum 1 day";
    if (data.n_days > 30) errs.n_days = "Maximum 30 days";
    return errs;
  };

  async function onSubmit(data: FormValues) {
    const validationErrors = validateForm(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    setResult(null);
    try {
      const res = await api.predict(data);
      setResult(res);
      addPredictResult({ ...res, timestamp: new Date().toISOString() });
    } catch (err) {
      setResult({
        ...data,
        success: false,
        forecast: {},
        message: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const n_days = watch("n_days");

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Predict Volatility"
        subtitle="Generate a multi-day volatility forecast from a trained model"
        badge="PREDICT"
      />
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
            <div className="space-y-4">
              {lastFit && (
                <div className="rounded-xl border border-[hsl(265,83%,68%/0.2)] bg-[hsl(265,83%,68%/0.05)] p-4 animate-fade-up">
                  <p className="mono text-[10px] uppercase tracking-widest text-[hsl(var(--purple))] mb-1">
                    Last Trained Model
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {lastFit.ticker}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    GARCH({lastFit.p},{lastFit.q}) · {lastFit.n_observations}{" "}
                    obs
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-border bg-card p-6 animate-fade-up delay-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                      Ticker Symbol
                    </Label>
                    <Input
                      {...register("ticker", {
                        setValueAs: (v) => v.toUpperCase(),
                      })}
                      placeholder="AAPL"
                      className="mono font-semibold uppercase bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-[hsl(var(--purple))] text-base h-11"
                    />
                    {errors.ticker && (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {errors.ticker}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60">
                      Must match a previously trained model
                    </p>
                  </div>
                  <Separator className="bg-border/60" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                        Forecast Horizon
                      </Label>
                      <div className="flex items-center gap-1.5 bg-[hsl(265,83%,68%/0.1)] border border-[hsl(265,83%,68%/0.2)] rounded-md px-2.5 py-1">
                        <span className="mono text-sm font-semibold text-[hsl(var(--purple))]">
                          {n_days}
                        </span>
                        <span className="mono text-xs text-muted-foreground">
                          {n_days === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      value={[n_days]}
                      onValueChange={([v]) => setValue("n_days", v)}
                      className="[&_[role=slider]]:border-[hsl(var(--purple))] [&_[role=slider]]:bg-[hsl(var(--purple))] [&_.bg-primary]:bg-[hsl(var(--purple))]"
                    />
                    <div className="flex justify-between mt-1.5">
                      {[1, 5, 10, 15, 20, 30].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setValue("n_days", v)}
                          className={`mono text-[10px] tabular-nums transition-colors ${n_days === v ? "text-[hsl(var(--purple))]" : "text-muted-foreground/40 hover:text-muted-foreground"}`}
                        >
                          {v}d
                        </button>
                      ))}
                    </div>
                    {errors.n_days && (
                      <p className="text-[0.8rem] font-medium text-destructive">
                        {errors.n_days}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      Number of business days ahead to forecast
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Forecasting…
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Generate Forecast
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            <div className="min-h-[400px] animate-fade-up delay-200">
              {!result && !isLoading && (
                <div className="rounded-xl border border-dashed border-border bg-card/40 h-full min-h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-3 px-6">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(265,83%,68%/0.1)] border border-[hsl(265,83%,68%/0.2)] flex items-center justify-center mx-auto">
                      <TrendingUp className="w-5 h-5 text-[hsl(var(--purple))]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        No forecast yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Select a ticker and horizon, then click{" "}
                        <span className="mono">Generate Forecast</span> to see
                        the volatility chart here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {isLoading && (
                <div className="rounded-xl border border-border bg-card h-full min-h-[400px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-2 border-[hsl(var(--purple))] opacity-20 animate-ping" />
                      <div className="w-12 h-12 rounded-full border-2 border-[hsl(265,83%,68%/0.3)] border-t-[hsl(var(--purple))] animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Running forecast…
                      </p>
                      <p className="mono text-xs text-muted-foreground mt-1">
                        GARCH volatility model computing
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {result && !isLoading && (
                <>
                  {result.success && Object.keys(result.forecast).length > 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                      <VolatilityChart
                        forecast={result.forecast}
                        ticker={result.ticker}
                      />
                    </div>
                  ) : (
                    <ErrorCard message={result.message} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
