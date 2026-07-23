"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success?: true; error?: string };

async function getOwnerStatus(ownerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("owners")
    .select("id, status")
    .eq("id", ownerId)
    .single();
  if (error || !data) return { error: "Owner no encontrado." } as const;
  return { status: data.status } as const;
}

export async function activateOwnerAccount(ownerId: string): Promise<ActionResult> {
  const current = await getOwnerStatus(ownerId);
  if ("error" in current) return { error: current.error };
  if (current.status !== "PENDING_ONBOARDING") {
    return { error: "Solo se pueden activar cuentas en onboarding pendiente." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("owners")
    .update({ status: "ACTIVE" })
    .eq("id", ownerId);
  if (error) return { error: "No se pudo activar la cuenta." };

  revalidatePath("/owners");
  revalidatePath("/");
  return { success: true };
}

export async function suspendOwnerAccount(ownerId: string): Promise<ActionResult> {
  const current = await getOwnerStatus(ownerId);
  if ("error" in current) return { error: current.error };
  if (current.status !== "ACTIVE") {
    return { error: "Solo se pueden suspender cuentas activas." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("owners")
    .update({ status: "SUSPENDED" })
    .eq("id", ownerId);
  if (error) return { error: "No se pudo suspender la cuenta." };

  revalidatePath("/owners");
  revalidatePath("/");
  return { success: true };
}

export async function reactivateOwnerAccount(ownerId: string): Promise<ActionResult> {
  const current = await getOwnerStatus(ownerId);
  if ("error" in current) return { error: current.error };
  if (current.status !== "SUSPENDED") {
    return { error: "Solo se pueden reactivar cuentas suspendidas." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("owners")
    .update({ status: "ACTIVE" })
    .eq("id", ownerId);
  if (error) return { error: "No se pudo reactivar la cuenta." };

  revalidatePath("/owners");
  revalidatePath("/");
  return { success: true };
}
