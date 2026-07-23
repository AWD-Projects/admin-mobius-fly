import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  icon: Icon,
  label,
  value,
  href,
  tone = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  href?: string;
  tone?: "primary" | "warning" | "success" | "secondary";
}) {
  const toneClasses: Record<typeof tone, string> = {
    primary: "bg-primary/12 text-primary",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/12 text-success",
    secondary: "bg-secondary/10 text-secondary",
  };

  const content = (
    <Card className={cn(href && "transition-transform hover:-translate-y-0.5")}>
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-md",
            toneClasses[tone]
          )}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl leading-none font-semibold tracking-[-0.008em] text-foreground">
            {value}
          </p>
          <p className="mt-1.5 truncate text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
