import { cn } from "@/lib/utils";

// Palette copied verbatim from mobius-fly/components/molecules/StatusBadge.tsx
// so admin status pills read identically to the owner-facing app.
type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "scheduled"
  | "in-review"
  | "approved"
  | "rejected"
  | "completed"
  | "on-time"
  | "info";

const STATUS_CONFIG: Record<StatusVariant, { dot: string; text: string; bg: string }> = {
  inactive: { dot: "bg-neutral", text: "text-muted-foreground", bg: "bg-background" },
  active: { dot: "bg-[#2E7D32]", text: "text-[#2E7D32]", bg: "bg-[#E8F5E9]" },
  pending: { dot: "bg-[#F57F17]", text: "text-[#F57F17]", bg: "bg-[#FFF8E1]" },
  scheduled: { dot: "bg-[#1565C0]", text: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
  "in-review": { dot: "bg-[#6A1B9A]", text: "text-[#6A1B9A]", bg: "bg-[#F3E5F5]" },
  approved: { dot: "bg-[#00695C]", text: "text-[#00695C]", bg: "bg-[#E0F2F1]" },
  rejected: { dot: "bg-[#C62828]", text: "text-[#C62828]", bg: "bg-[#FFEBEE]" },
  completed: { dot: "bg-[#558B2F]", text: "text-[#558B2F]", bg: "bg-[#F1F8E9]" },
  "on-time": { dot: "bg-[#00796B]", text: "text-[#00796B]", bg: "bg-[#E0F2F1]" },
  info: { dot: "bg-[#1565C0]", text: "text-[#1565C0]", bg: "bg-[#E3F2FD]" },
};

const CODE_TO_VARIANT: Record<string, StatusVariant> = {
  // flight_status
  SCHEDULED: "scheduled",
  ON_TIME: "on-time",
  DELAYED: "pending",
  IN_FLIGHT: "info",
  COMPLETED: "completed",
  CANCELLED: "rejected",
  PENDING_REVIEW: "in-review",
  REJECTED: "rejected",
  // document_status
  APPROVED: "approved",
  // owners / crew_members
  PENDING_ONBOARDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "rejected",
  // reservation_status
  CONFIRMED: "approved",
  BLOCKED: "pending",
  EXPIRED: "inactive",
  // payments
  PAID: "approved",
  PENDING: "pending",
  // generic boolean pills
  YES: "approved",
  NO: "inactive",
};

export function StatusBadge({
  code,
  label,
  showDot = true,
  className,
}: {
  code: string;
  label: string;
  showDot?: boolean;
  className?: string;
}) {
  const config = STATUS_CONFIG[CODE_TO_VARIANT[code] ?? "inactive"];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      )}
      {label}
    </div>
  );
}
