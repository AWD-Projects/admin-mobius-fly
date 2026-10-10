"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCatalogId } from "@/lib/catalog";

type ActionResult = { success?: true; error?: string };

function revalidateFlights() {
  revalidatePath("/aprobaciones/vuelos");
  revalidatePath("/vuelos");
  revalidatePath("/");
}

export async function approveFlight(flightId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const supabase = createAdminClient();
  const [pendingId, scheduledId] = await Promise.all([
    getCatalogId("flight_status", "PENDING_REVIEW"),
    getCatalogId("flight_status", "SCHEDULED"),
  ]);

  // Conditioning the update on the current status makes the transition atomic:
  // if another admin already resolved this flight, zero rows match.
  const { data, error } = await supabase
    .from("flights")
    .update({ status_id: scheduledId, rejected_reason: null, is_visible: true })
    .eq("id", flightId)
    .eq("status_id", pendingId)
    .select("id");
  if (error) return { error: "No se pudo aprobar el vuelo." };
  if (!data?.length) {
    return { error: "El vuelo ya no está en revisión o no existe." };
  }

  revalidateFlights();
  return { success: true };
}

export async function rejectFlight(
  flightId: string,
  reason: string
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  if (!reason.trim()) return { error: "El motivo de rechazo es obligatorio." };

  const supabase = createAdminClient();
  const [pendingId, rejectedId] = await Promise.all([
    getCatalogId("flight_status", "PENDING_REVIEW"),
    getCatalogId("flight_status", "REJECTED"),
  ]);

  const { data, error } = await supabase
    .from("flights")
    .update({ status_id: rejectedId, rejected_reason: reason.trim(), is_visible: false })
    .eq("id", flightId)
    .eq("status_id", pendingId)
    .select("id");
  if (error) return { error: "No se pudo rechazar el vuelo." };
  if (!data?.length) {
    return { error: "El vuelo ya no está en revisión o no existe." };
  }

  revalidateFlights();
  return { success: true };
}
