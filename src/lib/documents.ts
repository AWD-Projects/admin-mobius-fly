import { createAdminClient } from "@/lib/supabase/admin";
import { getCatalogId } from "@/lib/catalog";

export type DocumentTable = "user_documents" | "aircraft_documents";

type ActionResult = { success?: true; error?: string };

export async function approveDocument(
  table: DocumentTable,
  id: string
): Promise<ActionResult> {
  const supabase = createAdminClient();

  const { data: doc, error: fetchError } = await supabase
    .from(table)
    .select("id, document_status_id")
    .eq("id", id)
    .single();
  if (fetchError || !doc) return { error: "Documento no encontrado." };

  const { data: status } = await supabase
    .from("document_status")
    .select("code")
    .eq("id", doc.document_status_id)
    .single();
  if (status?.code !== "PENDING_REVIEW") {
    return { error: "Solo se pueden aprobar documentos pendientes de revisión." };
  }

  const approvedId = await getCatalogId("document_status", "APPROVED");

  const { error: updateError } = await supabase
    .from(table)
    .update({ document_status_id: approvedId, rejected_reason: null })
    .eq("id", id);
  if (updateError) return { error: "No se pudo aprobar el documento." };

  return { success: true };
}

export async function rejectDocument(
  table: DocumentTable,
  id: string,
  reason: string
): Promise<ActionResult> {
  if (!reason.trim()) return { error: "El motivo de rechazo es obligatorio." };

  const supabase = createAdminClient();

  const { data: doc, error: fetchError } = await supabase
    .from(table)
    .select("id, document_status_id")
    .eq("id", id)
    .single();
  if (fetchError || !doc) return { error: "Documento no encontrado." };

  const { data: status } = await supabase
    .from("document_status")
    .select("code")
    .eq("id", doc.document_status_id)
    .single();
  if (status?.code !== "PENDING_REVIEW") {
    return { error: "Solo se pueden rechazar documentos pendientes de revisión." };
  }

  const rejectedId = await getCatalogId("document_status", "REJECTED");

  const { error: updateError } = await supabase
    .from(table)
    .update({ document_status_id: rejectedId, rejected_reason: reason })
    .eq("id", id);
  if (updateError) return { error: "No se pudo rechazar el documento." };

  return { success: true };
}
