"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { approveDocument, rejectDocument } from "@/lib/documents";

export async function approveAircraftDocument(id: string) {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  const result = await approveDocument("aircraft_documents", id);
  if (!result.error) {
    revalidatePath("/aprobaciones/documentos-aeronaves");
    revalidatePath("/vuelos");
    revalidatePath("/");
  }
  return result;
}

export async function rejectAircraftDocument(id: string, reason: string) {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  const result = await rejectDocument("aircraft_documents", id, reason);
  if (!result.error) {
    revalidatePath("/aprobaciones/documentos-aeronaves");
    revalidatePath("/vuelos");
    revalidatePath("/");
  }
  return result;
}
