import { cn } from "@/lib/utils";

export function QueueCard({
  avatar,
  title,
  subtitle,
  meta,
  children,
  footer,
}: {
  avatar: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-hover)]">
      <div className="flex items-start gap-3.5 p-5">
        {avatar}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {meta}
      </div>
      {children && (
        <>
          <div className="h-px bg-border" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 sm:grid-cols-4">
            {children}
          </div>
        </>
      )}
      <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/25 px-5 py-3">
        {footer}
      </div>
    </div>
  );
}

export function QueueAvatar({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary",
        className
      )}
    >
      <Icon size={19} strokeWidth={1.75} />
    </div>
  );
}

export function QueueInitials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E3F2FD] text-sm font-semibold text-[#1565C0]",
        className
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function DetailField({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground/80">
        {Icon && <Icon size={12} strokeWidth={2} />}
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
