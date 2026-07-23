import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent font-medium tracking-[0.01em] whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:brightness-110 hover:-translate-y-px",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] hover:brightness-110 hover:-translate-y-px",
        outline:
          "border-border bg-transparent text-foreground hover:bg-muted/60 hover:border-foreground",
        ghost:
          "border-border text-foreground hover:bg-muted/60 hover:border-foreground/30",
        destructive:
          "border-destructive bg-destructive text-white shadow-[var(--shadow-soft)] hover:brightness-110 hover:-translate-y-px",
        "ghost-destructive":
          "border-destructive text-destructive hover:bg-muted/60 hover:border-destructive",
        link: "border-0 text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-5 text-xs",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading ? <Loader2 className="animate-spin" /> : null}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
