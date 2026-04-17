"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { BrainCircuit, Loader2 } from "@/atoms/icon";
import { PageHeader } from "@/organisms/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { InfoBanner } from "@/molecules/info-banner";
import { ResultCard } from "@/organisms/result-card";
import { api, FitResponse } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { Label } from "@/components/ui/label";

interface FormValues {
  ticker: string;
  use_new_data: boolean;
  n_observations: number;
  p: number;
  q: number;
}

export function FitTemplate() {
  const addFitResult = useAppStore((s) => s.addFitResult);
  const [result, setResult] = useState<FitResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      ticker: "AAPL",
      use_new_data: true,
      n_observations: 1000,
      p: 1,
      q: 1,
    },
  });

  const validateForm = (data: FormValues): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!data.ticker) errs.ticker = "Ticker is required";
    else if (data.ticker.length > 10) errs.ticker = "Max 10 characters";
    if (data.n_observations < 50)
      errs.n_observations = "Minimum 50 observations";
    if (data.n_observations > 5000) errs.n_observations = "Maximum 5000";
    if (data.p < 1) errs.p = "Min 1";
    if (data.p > 10) errs.p = "Max 10";
    if (data.q < 1) errs.q = "Min 1";
    if (data.q > 10) errs.q = "Max 10";
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
      const res = await api.fit(data);
      setResult(res);
      addFitResult({ ...res, timestamp: new Date().toISOString() });
    } catch (err) {
      setResult({
        ...data,
        success: false,
        message: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const use_new_data = watch("use_new_data");

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Train Model"
        subtitle="Fit a GARCH(p,q) model to equity data"
        badge="FIT"
      />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <InfoBanner
            title="GARCH Model Training"
            description="Fill in the equity ticker and model parameters. Enable use_new_data to fetch fresh prices from AlphaVantage. The model will be saved locally for subsequent forecasting."
          />
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
                  className="mono font-semibold uppercase bg-muted/30 border-border text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-[hsl(var(--cyan))] text-base h-11"
                />
                {errors.ticker && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errors.ticker}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60">
                  NYSE / NASDAQ ticker (e.g. AAPL, MSFT, TSLA)
                </p>
              </div>
              <Separator className="bg-border/60" />
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3 gap-4">
                <div className="space-y-0.5">
                  <Label className="mono text-xs uppercase tracking-widest text-muted-foreground cursor-pointer">
                    Fetch New Data
                  </Label>
                  <p className="text-xs text-muted-foreground/60">
                    Download latest prices from AlphaVantage API
                  </p>
                </div>
                <Switch
                  {...register("use_new_data")}
                  checked={use_new_data}
                  className="data-[state=checked]:bg-[hsl(var(--cyan))]"
                />
              </div>
              <Separator className="bg-border/60" />
              <div className="space-y-2">
                <Label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                  Observations (n)
                </Label>
                <Input
                  type="number"
                  {...register("n_observations", {
                    setValueAs: (v) => Number(v),
                  })}
                  className="mono bg-muted/30 border-border text-foreground focus-visible:ring-[hsl(var(--cyan))] h-11"
                />
                {errors.n_observations && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {errors.n_observations}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60">
                  Number of most recent trading days to use for training
                  (50–5000)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                    ARCH Order (p)
                  </Label>
                  <Input
                    type="number"
                    {...register("p", { setValueAs: (v) => Number(v) })}
                    className="mono bg-muted/30 border-border text-foreground focus-visible:ring-[hsl(var(--cyan))] h-11"
                  />
                  {errors.p && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {errors.p}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    Lag order of innovation
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="mono text-xs uppercase tracking-widest text-muted-foreground">
                    GARCH Order (q)
                  </Label>
                  <Input
                    type="number"
                    {...register("q", { setValueAs: (v) => Number(v) })}
                    className="mono bg-muted/30 border-border text-foreground focus-visible:ring-[hsl(var(--cyan))] h-11"
                  />
                  {errors.q && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {errors.q}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    Lag order of volatility
                  </p>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Training model…
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    Train GARCH Model
                  </>
                )}
              </Button>
            </form>
          </div>
          {result && (
            <ResultCard
              result={result}
              onRetry={() => handleSubmit(onSubmit)()}
            />
          )}
        </div>
      </main>
    </div>
  );
}
