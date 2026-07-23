import { FileCheck2, ExternalLink, Calendar, CircleUser } from "lucide-react";
import { getPendingAircraftDocuments } from "@/lib/queue";
import { ApprovalActions } from "@/components/approval-actions";
import { QueueCard, QueueAvatar, DetailField } from "@/components/queue-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { formatDateTime } from "@/lib/format";
import {
  approveAircraftDocument,
  rejectAircraftDocument,
} from "@/app/actions/aircraft-documents";

const AIRCRAFT_DOC_TYPE_LABEL: Record<string, string> = {
  PROOF_OF_OWNERSHIP: "Proof of ownership",
  PERMITS: "Permisos AFAC / DGAC",
  POWER_OF_ATTORNEY: "Carta poder notariada",
};

export default async function AprobacionesDocumentosAeronavesPage() {
  const documents = await getPendingAircraftDocuments();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={FileCheck2}
        title="Documentos de aeronaves"
        description="Revisa la documentación legal de cada aeronave antes de habilitarla."
      />

      {documents.length === 0 && (
        <EmptyState label="No hay documentos de aeronaves pendientes." />
      )}

      <div className="flex flex-col gap-4">
        {documents.map((doc) => (
          <QueueCard
            key={doc.id}
            avatar={<QueueAvatar icon={FileCheck2} />}
            title={`${doc.aircraft?.tail_number ?? "—"} · ${doc.aircraft?.model ?? "—"}`}
            subtitle={AIRCRAFT_DOC_TYPE_LABEL[doc.document_type] ?? doc.document_type}
            meta={<StatusBadge code="PENDING_REVIEW" label="En revisión" />}
            footer={
              <ApprovalActions
                id={doc.id}
                itemLabel={`documento de ${doc.aircraft?.tail_number ?? "aeronave"}`}
                onApprove={approveAircraftDocument}
                onReject={rejectAircraftDocument}
              />
            }
          >
            <DetailField
              icon={CircleUser}
              label="Owner"
              value={doc.aircraft?.owner?.fleet_name ?? "—"}
            />
            <DetailField
              icon={Calendar}
              label="Recibido"
              value={doc.created_at ? formatDateTime(doc.created_at) : "—"}
            />
            <div className="col-span-2 flex items-end sm:col-span-2">
              <a
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted/40"
              >
                Ver documento
                <ExternalLink size={13} strokeWidth={2} />
              </a>
            </div>
          </QueueCard>
        ))}
      </div>
    </div>
  );
}
