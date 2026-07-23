import {
  LayoutDashboard,
  Plane,
  IdCard,
  FileCheck2,
  Users,
  CircleUser,
  PlaneTakeoff,
} from "lucide-react";
import { getDashboardStats } from "@/lib/dashboard";
import { PageHeader } from "@/components/page-header";
import { StatTile } from "@/components/stat-tile";
import { BarList } from "@/components/bar-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const totalPending =
    stats.queueCounts.flights +
    stats.queueCounts.ownerDocuments +
    stats.queueCounts.aircraftDocuments +
    stats.queueCounts.crew;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Panorama general de aprobaciones y operación de Mobius Fly."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile
          icon={Plane}
          label="Vuelos pendientes"
          value={stats.queueCounts.flights}
          href="/aprobaciones/vuelos"
          tone="warning"
        />
        <StatTile
          icon={IdCard}
          label="Docs. owners pendientes"
          value={stats.queueCounts.ownerDocuments}
          href="/aprobaciones/documentos-owners"
          tone="warning"
        />
        <StatTile
          icon={FileCheck2}
          label="Docs. aeronaves pendientes"
          value={stats.queueCounts.aircraftDocuments}
          href="/aprobaciones/documentos-aeronaves"
          tone="warning"
        />
        <StatTile
          icon={Users}
          label="Tripulación pendiente"
          value={stats.queueCounts.crew}
          href="/aprobaciones/tripulacion"
          tone="warning"
        />
        <StatTile
          icon={CircleUser}
          label="Owners activos"
          value={stats.ownersByStatus.ACTIVE}
          href="/owners"
          tone="success"
        />
        <StatTile
          icon={PlaneTakeoff}
          label="Vuelos totales"
          value={stats.totalFlights}
          href="/vuelos"
          tone="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pendientes por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {totalPending === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                No hay nada pendiente de revisión.
              </p>
            ) : (
              <BarList
                items={[
                  {
                    label: "Vuelos",
                    value: stats.queueCounts.flights,
                    color: "#D8A32A",
                    href: "/aprobaciones/vuelos",
                  },
                  {
                    label: "Documentos de owners",
                    value: stats.queueCounts.ownerDocuments,
                    color: "#D8A32A",
                    href: "/aprobaciones/documentos-owners",
                  },
                  {
                    label: "Documentos de aeronaves",
                    value: stats.queueCounts.aircraftDocuments,
                    color: "#D8A32A",
                    href: "/aprobaciones/documentos-aeronaves",
                  },
                  {
                    label: "Tripulación",
                    value: stats.queueCounts.crew,
                    color: "#D8A32A",
                    href: "/aprobaciones/tripulacion",
                  },
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Owners por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={[
                {
                  label: "Activos",
                  value: stats.ownersByStatus.ACTIVE,
                  color: "#2E7D32",
                  href: "/owners",
                },
                {
                  label: "Onboarding pendiente",
                  value: stats.ownersByStatus.PENDING_ONBOARDING,
                  color: "#F57F17",
                  href: "/owners",
                },
                {
                  label: "Suspendidos",
                  value: stats.ownersByStatus.SUSPENDED,
                  color: "#C62828",
                  href: "/owners",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
