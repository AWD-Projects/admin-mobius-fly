import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors mobius-fly/components/atoms/Select.tsx (native <select>, chevron overlay).
function NativeSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative w-full min-w-0">
      <select
        className={cn(
          "flex h-10 w-full min-w-0 appearance-none rounded-sm border border-border bg-card px-3 py-2 pr-8 text-xs text-foreground transition-all",
          "focus-visible:border-2 focus-visible:border-foreground focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-40",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export { NativeSelect };
