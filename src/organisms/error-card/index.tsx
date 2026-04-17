import { AlertCircle } from "@/atoms/icon";

interface ErrorCardProps {
  message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-4 noise">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">Forecast Failed</p>
          <p className="text-xs text-muted-foreground">Check that the model has been trained for this ticker.</p>
        </div>
      </div>
      <div className="rounded-lg bg-muted/30 border border-border px-4 py-3">
        <p className="mono text-xs text-muted-foreground break-words">{message}</p>
      </div>
    </div>
  );
}