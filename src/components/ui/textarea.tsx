import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm transition-all outline-none placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:border-2 focus-visible:bg-card disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-40 aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
