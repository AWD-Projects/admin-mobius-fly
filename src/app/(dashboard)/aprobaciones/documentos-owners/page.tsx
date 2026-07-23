import { IdCard, ExternalLink, Calendar } from "lucide-react";
import { getPendingOwnerDocuments } from "@/lib/queue";
import { ApprovalActions } from "@/components/approval-actions";
import { QueueCard, QueueInitials, DetailField } from "@/components/queue-card";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { formatDateTime } from "@/lib/format";
import {
  approveOwnerDocument,
  rejectOwnerDocument,
} from "@/app/actions/owner-documents";

const OWNER_DOC_TYPE_LABEL: Record<string, string> = {
  IDENTITY: "Identificación oficial",
};

export default async function AprobacionesDocumentosOwnersPage() {
  const documents = await getPendingOwnerDocuments();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={IdCard}
        title="Documentos de owners"
        description="Verifica la identidad de los propietarios antes de activarlos."
      />

      {documents.length === 0 && (
        <EmptyState label="No hay documentos de owners pendientes." />
      )}

      <div className="flex flex-col gap-4">
        {documents.map((doc) => {
          const name = `${doc.user_profile?.first_name ?? ""} ${doc.user_profile?.last_name ?? ""}`.trim();

          return (
            <QueueCard
              key={doc.id}
              avatar={<QueueInitials name={name || "?"} />}
              title={name || "Owner"}
              subtitle={OWNER_DOC_TYPE_LABEL[doc.document_type] ?? doc.document_type}
              meta={<StatusBadge code="PENDING_REVIEW" label="En revisión" />}
              footer={
                <ApprovalActions
                  id={doc.id}
                  itemLabel={`documento de ${doc.user_profile?.first_name ?? "owner"}`}
                  onApprove={approveOwnerDocument}
                  onReject={rejectOwnerDocument}
                />
              }
            >
              <DetailField
                icon={Calendar}
                label="Recibido"
                value={doc.created_at ? formatDateTime(doc.created_at) : "—"}
              />
              <div className="col-span-2 flex items-end sm:col-span-3">
                {doc.signedDocumentUrl ? (
                  <a
                    href={doc.signedDocumentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-muted/40"
                  >
                    Ver documento
                    <ExternalLink size={13} strokeWidth={2} />
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No se pudo generar el enlace del documento.
                  </span>
                )}
              </div>
            </QueueCard>
          );
        })}
      </div>
    </div>
  );
}
