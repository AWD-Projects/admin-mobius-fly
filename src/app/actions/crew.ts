"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success?: true; error?: string };

async function getCrewMember(crewMemberId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("crew_members")
    .select("id, is_approved")
    .eq("id", crewMemberId)
    .single();
  if (error || !data) return { error: "Tripulante no encontrado." } as const;
  return { crewMember: data } as const;
}

export async function approveCrewMember(
  crewMemberId: string
): Promise<ActionResult> {
  const result = await getCrewMember(crewMemberId);
  if ("error" in result) return { error: result.error };
  if (result.crewMember.is_approved) {
    return { error: "Este tripulante ya fue aprobado." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("crew_members")
    .update({ status: "ACTIVE", is_approved: true, rejected_reason: null })
    .eq("id", crewMemberId);
  if (error) return { error: "No se pudo aprobar al tripulante." };

  revalidatePath("/aprobaciones/tripulacion");
  revalidatePath("/");
  return { success: true };
}

export async function rejectCrewMember(
  crewMemberId: string,
  reason: string
): Promise<ActionResult> {
  if (!reason.trim()) return { error: "El motivo de rechazo es obligatorio." };

  const result = await getCrewMember(crewMemberId);
  if ("error" in result) return { error: result.error };
  if (result.crewMember.is_approved) {
    return { error: "Este tripulante ya fue aprobado; no se puede rechazar directamente." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("crew_members")
    .update({ status: "REJECTED", is_approved: false, rejected_reason: reason })
    .eq("id", crewMemberId);
  if (error) return { error: "No se pudo rechazar al tripulante." };

  revalidatePath("/aprobaciones/tripulacion");
  revalidatePath("/");
  return { success: true };
}
