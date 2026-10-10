"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success?: true; error?: string };

function revalidateCrew() {
  revalidatePath("/aprobaciones/tripulacion");
  revalidatePath("/");
}

export async function approveCrewMember(
  crewMemberId: string
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  // status + is_approved go in one UPDATE (atomic), conditioned on the member
  // still being unapproved so a concurrent decision is never overwritten.
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crew_members")
    .update({ status: "ACTIVE", is_approved: true, rejected_reason: null })
    .eq("id", crewMemberId)
    .eq("is_approved", false)
    .select("id");
  if (error) return { error: "No se pudo aprobar al tripulante." };
  if (!data?.length) {
    return { error: "El tripulante ya fue aprobado o no existe." };
  }

  revalidateCrew();
  return { success: true };
}

export async function rejectCrewMember(
  crewMemberId: string,
  reason: string
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };
  if (!reason.trim()) return { error: "El motivo de rechazo es obligatorio." };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crew_members")
    .update({ status: "REJECTED", is_approved: false, rejected_reason: reason.trim() })
    .eq("id", crewMemberId)
    .eq("is_approved", false)
    .select("id");
  if (error) return { error: "No se pudo rechazar al tripulante." };
  if (!data?.length) {
    return { error: "El tripulante ya fue aprobado; no se puede rechazar directamente." };
  }

  revalidateCrew();
  return { success: true };
}
