import { Users, Mail, Phone, BadgeCheck, CircleUser } from "lucide-react";
import { getPendingCrewMembers } from "@/lib/queue";
import { ApprovalActions } from "@/components/approval-actions";
import { QueueCard, QueueInitials, DetailField } from "@/components/queue-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { approveCrewMember, rejectCrewMember } from "@/app/actions/crew";

export default async function AprobacionesTripulacionPage() {
  const crewMembers = await getPendingCrewMembers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Users}
        title="Tripulación pendiente"
        description="Valida a los tripulantes antes de que puedan asignarse a un vuelo."
      />

      {crewMembers.length === 0 && <EmptyState label="No hay tripulación pendiente." />}

      <div className="flex flex-col gap-4">
        {crewMembers.map((crew) => {
          const name = `${crew.first_name} ${crew.last_name}`;

          return (
            <QueueCard
              key={crew.id}
              avatar={<QueueInitials name={name} />}
              title={name}
              subtitle={crew.crew_role?.name ?? "—"}
              meta={<StatusBadge code="PENDING_REVIEW" label="Pendiente" />}
              footer={
                <ApprovalActions
                  id={crew.id}
                  itemLabel={name}
                  onApprove={approveCrewMember}
                  onReject={rejectCrewMember}
                />
              }
            >
              <DetailField
                icon={CircleUser}
                label="Fleet"
                value={crew.owner?.fleet_name ?? "—"}
              />
              <DetailField
                icon={BadgeCheck}
                label="Licencia"
                value={crew.license_number ?? "—"}
              />
              <DetailField icon={Mail} label="Correo" value={crew.email ?? "—"} />
              <DetailField icon={Phone} label="Teléfono" value={crew.phone ?? "—"} />
            </QueueCard>
          );
        })}
      </div>
    </div>
  );
}
