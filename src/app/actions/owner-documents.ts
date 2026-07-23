"use server";

import { revalidatePath } from "next/cache";
import { approveDocument, rejectDocument } from "@/lib/documents";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Approving an owner's identity document is the only gate on their onboarding,
 * so it also activates the account in the same step instead of requiring a
 * separate "Aprobar cuenta" click in /owners.
 */
async function activateOwnerAccountForDocument(userDocumentId: string) {
  const supabase = createAdminClient();

  const { data: doc } = await supabase
    .from("user_documents")
    .select("user_id")
    .eq("id", userDocumentId)
    .single();
  if (!doc) return;

  const { data: owner } = await supabase
    .from("owners")
    .select("id, status")
    .eq("user_id", doc.user_id)
    .maybeSingle();

  if (owner && owner.status === "PENDING_ONBOARDING") {
    await supabase.from("owners").update({ status: "ACTIVE" }).eq("id", owner.id);
  }
}

export async function approveOwnerDocument(id: string) {
  const result = await approveDocument("user_documents", id);
  if (result.error) return result;

  await activateOwnerAccountForDocument(id);

  revalidatePath("/aprobaciones/documentos-owners");
  revalidatePath("/owners");
  revalidatePath("/");
  return result;
}

export async function rejectOwnerDocument(id: string, reason: string) {
  const result = await rejectDocument("user_documents", id, reason);
  if (!result.error) {
    revalidatePath("/aprobaciones/documentos-owners");
    revalidatePath("/");
  }
  return result;
}
