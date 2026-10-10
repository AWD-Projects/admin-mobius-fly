import Link from "next/link";
import { cn } from "@/lib/utils";

// Dark KPI card from mobius-fly/components/organisms/KpiCard.tsx: secondary
// background, #2f3741 icon well, large white value.
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
  const iconTone: Record<typeof tone, string> = {
    primary: "text-primary",
    warning: "text-warning",
    success: "text-success",
    secondary: "text-white",
  };

  const content = (
    <div
      className={cn(
        "flex h-full flex-col gap-4 rounded-md bg-secondary p-6 shadow-[var(--shadow-soft)] transition-all",
        href && "hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-sm bg-[#2f3741]">
        <Icon className={cn("size-[18px]", iconTone[tone])} strokeWidth={1.5} />
      </div>
      <p className="text-[2.5rem] leading-none font-semibold tracking-tight text-white tabular-nums">
        {value}
      </p>
      <p className="text-sm leading-tight font-medium text-white">{label}</p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}
