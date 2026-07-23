"use server";

import { revalidatePath } from "next/cache";
import { approveDocument, rejectDocument } from "@/lib/documents";

export async function approveAircraftDocument(id: string) {
  const result = await approveDocument("aircraft_documents", id);
  if (!result.error) {
    revalidatePath("/aprobaciones/documentos-aeronaves");
    revalidatePath("/vuelos");
    revalidatePath("/");
  }
  return result;
}

export async function rejectAircraftDocument(id: string, reason: string) {
  const result = await rejectDocument("aircraft_documents", id, reason);
  if (!result.error) {
    revalidatePath("/aprobaciones/documentos-aeronaves");
    revalidatePath("/vuelos");
    revalidatePath("/");
  }
  return result;
}
