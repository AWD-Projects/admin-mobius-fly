"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCatalogId } from "@/lib/catalog";

type ActionResult = { success?: true; error?: string };

async function getFlightStatusCode(flightId: string) {
  const supabase = createAdminClient();

  const { data: flight, error } = await supabase
    .from("flights")
    .select("id, status_id")
    .eq("id", flightId)
    .single();
  if (error || !flight) return { error: "Vuelo no encontrado." } as const;

  const { data: status } = await supabase
    .from("flight_status")
    .select("code")
    .eq("id", flight.status_id)
    .single();

  return { code: status?.code ?? null } as const;
}

export async function approveFlight(flightId: string): Promise<ActionResult> {
  const current = await getFlightStatusCode(flightId);
  if ("error" in current) return { error: current.error };
  if (current.code !== "PENDING_REVIEW") {
    return { error: "Solo se pueden aprobar vuelos en revisión." };
  }

  const supabase = createAdminClient();
  const scheduledId = await getCatalogId("flight_status", "SCHEDULED");

  const { error } = await supabase
    .from("flights")
    .update({ status_id: scheduledId, rejected_reason: null, is_visible: true })
    .eq("id", flightId);
  if (error) return { error: "No se pudo aprobar el vuelo." };

  revalidatePath("/aprobaciones/vuelos");
  revalidatePath("/vuelos");
  revalidatePath("/");
  return { success: true };
}

export async function rejectFlight(
  flightId: string,
  reason: string
): Promise<ActionResult> {
  if (!reason.trim()) return { error: "El motivo de rechazo es obligatorio." };

  const current = await getFlightStatusCode(flightId);
  if ("error" in current) return { error: current.error };
  if (current.code !== "PENDING_REVIEW") {
    return { error: "Solo se pueden rechazar vuelos en revisión." };
  }

  const supabase = createAdminClient();
  const rejectedId = await getCatalogId("flight_status", "REJECTED");

  const { error } = await supabase
    .from("flights")
    .update({ status_id: rejectedId, rejected_reason: reason, is_visible: false })
    .eq("id", flightId);
  if (error) return { error: "No se pudo rechazar el vuelo." };

  revalidatePath("/aprobaciones/vuelos");
  revalidatePath("/vuelos");
  revalidatePath("/");
  return { success: true };
}
