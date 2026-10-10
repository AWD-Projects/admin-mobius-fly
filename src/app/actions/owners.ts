"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

type ActionResult = { success?: true; error?: string };
type OwnerStatus = "PENDING_ONBOARDING" | "ACTIVE" | "SUSPENDED";

/**
 * Moves an owner between states. The UPDATE is conditioned on the expected
 * current status, so skipping a state (RN03) or double-activating is rejected
 * even under concurrent requests.
 */
async function transitionOwner(
  ownerId: string,
  from: OwnerStatus,
  to: OwnerStatus,
  messages: { invalid: string; failed: string }
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("owners")
    .update({ status: to })
    .eq("id", ownerId)
    .eq("status", from)
    .select("id");
  if (error) return { error: messages.failed };
  if (!data?.length) return { error: messages.invalid };

  revalidatePath("/owners");
  revalidatePath("/");
  return { success: true };
}

export async function activateOwnerAccount(ownerId: string): Promise<ActionResult> {
  return transitionOwner(ownerId, "PENDING_ONBOARDING", "ACTIVE", {
    invalid: "Solo se pueden activar cuentas en onboarding pendiente.",
    failed: "No se pudo activar la cuenta.",
  });
}

export async function suspendOwnerAccount(ownerId: string): Promise<ActionResult> {
  return transitionOwner(ownerId, "ACTIVE", "SUSPENDED", {
    invalid: "Solo se pueden suspender cuentas activas.",
    failed: "No se pudo suspender la cuenta.",
  });
}

export async function reactivateOwnerAccount(ownerId: string): Promise<ActionResult> {
  return transitionOwner(ownerId, "SUSPENDED", "ACTIVE", {
    invalid: "Solo se pueden reactivar cuentas suspendidas.",
    failed: "No se pudo reactivar la cuenta.",
  });
}
