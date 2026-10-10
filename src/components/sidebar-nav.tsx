"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Plane,
  IdCard,
  FileCheck2,
  Users,
  CircleUser,
  PlaneTakeoff,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QueueCounts = {
  flights: number;
  ownerDocuments: number;
  aircraftDocuments: number;
  crew: number;
};

const QUEUE_ITEMS = [
  { key: "flights" as const, href: "/aprobaciones/vuelos", label: "Vuelos", icon: Plane },
  {
    key: "ownerDocuments" as const,
    href: "/aprobaciones/documentos-owners",
    label: "Documentos de owners",
    icon: IdCard,
  },
  {
    key: "aircraftDocuments" as const,
    href: "/aprobaciones/documentos-aeronaves",
    label: "Documentos de aeronaves",
    icon: FileCheck2,
  },
  {
    key: "crew" as const,
    href: "/aprobaciones/tripulacion",
    label: "Tripulación",
    icon: Users,
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  count,
  indent,
  exact,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  indent?: boolean;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-start gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
        indent && "ml-3 py-1.5 text-[13px]",
        isActive
          ? "bg-primary/15 text-white font-medium"
          : "text-sidebar-foreground/75 hover:bg-white/8 hover:text-white"
      )}
    >
      <Icon
        size={indent ? 16 : 18}
        strokeWidth={1.75}
        className={cn(
          "mt-0.5 shrink-0",
          isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-white"
        )}
      />
      <span className="flex-1 leading-snug">{label}</span>
      {!!count && (
        <span
          className={cn(
            "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-[11px] font-semibold",
            isActive ? "bg-primary text-secondary" : "bg-white/10 text-sidebar-foreground/80"
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}

export function SidebarNav({ counts }: { counts: QueueCounts }) {
  const totalQueue =
    counts.flights + counts.ownerDocuments + counts.aircraftDocuments + counts.crew;

  return (
    <nav className="flex flex-col gap-1">
      <NavLink href="/" label="Dashboard" icon={LayoutDashboard} exact />
      <NavLink href="/vuelos" label="Todos los vuelos" icon={PlaneTakeoff} />
      <NavLink href="/owners" label="Owners" icon={CircleUser} />
      <NavLink href="/aeropuertos" label="Aeropuertos" icon={MapPin} />

      <div className="mt-4 mb-1 flex items-center gap-2.5 px-3 py-2 text-sidebar-foreground/75">
        <ClipboardList size={18} strokeWidth={1.75} className="shrink-0 text-sidebar-foreground/60" />
        <span className="flex-1 text-sm font-medium tracking-wide uppercase text-[11px] text-sidebar-foreground/50">
          Aprobaciones
        </span>
        {!!totalQueue && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-secondary">
            {totalQueue}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        {QUEUE_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            count={counts[item.key]}
            indent
          />
        ))}
      </div>
    </nav>
  );
}
