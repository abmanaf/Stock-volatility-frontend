"use client";

interface EmptyStateProps {
  message: string;
  hint: string;
}

export function EmptyState({ message, hint }: EmptyStateProps) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs mx-auto">{hint}</p>
    </div>
  );
}