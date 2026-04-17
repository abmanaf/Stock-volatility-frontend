import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface StatusRowProps {
  icon: LucideIcon;
  label: string;
  status: string;
  ok?: boolean;
  loading?: boolean;
  tooltip?: string;
}

export function StatusRow({ 
  icon: Icon, 
  label, 
  status, 
  ok = false, 
  loading = false, 
  tooltip 
}: StatusRowProps) {
  
  const getStatusColor = () => {
    if (loading) return "bg-muted-foreground/30";
    if (ok) return "bg-[hsl(var(--green))]";
    if (ok === false) return "bg-destructive";
    return "bg-amber-400";
  };

  const getTextColor = () => {
    if (loading) return "text-muted-foreground/60";
    if (ok) return "text-[hsl(var(--green))]";
    if (ok === false) return "text-destructive";
    return "text-amber-400";
  };

  const content = (
    <div className="flex items-center gap-2 py-1">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <div className="flex items-center gap-1.5">
        {loading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground/60" />
            <span className="text-[10px] mono font-medium text-muted-foreground/60">
              Checking...
            </span>
          </>
        ) : (
          <>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor()} ${ok && !loading ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] mono font-medium ${getTextColor()}`}>
              {status}
            </span>
          </>
        )}
      </div>
    </div>
  );

  if (tooltip && !loading) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[200px]">
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}