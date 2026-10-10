import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

// Mirrors mobius-fly/components/molecules/EmptyState.tsx.
export function EmptyState({
  label,
  description,
  icon: Icon = Inbox,
  className,
}: {
  label: string;
  description?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg bg-muted/20 p-12",
        className
      )}
    >
      <Icon className="size-12 text-border" strokeWidth={1} />
      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-base font-semibold text-foreground">{label}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
