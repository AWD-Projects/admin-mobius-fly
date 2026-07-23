import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-sm border border-input bg-transparent px-3 py-2 text-sm transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:border-2 focus-visible:bg-card disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-40 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
