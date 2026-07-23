"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { UserCheck, Ban, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  activateOwnerAccount,
  reactivateOwnerAccount,
  suspendOwnerAccount,
} from "@/app/actions/owners";

const LOADING_LABEL: Record<string, string> = {
  activate: "Aprobando cuenta…",
  suspend: "Suspendiendo cuenta…",
  reactivate: "Reactivando cuenta…",
};

export function OwnerActions({
  ownerId,
  status,
}: {
  ownerId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function run(
    kind: "activate" | "suspend" | "reactivate",
    action: (id: string) => Promise<{ success?: true; error?: string }>
  ) {
    startTransition(async () => {
      await toast.promise(
        action(ownerId).then((result) => {
          if (result.error) throw new Error(result.error);
          return result;
        }),
        {
          loading: LOADING_LABEL[kind],
          success: "Cuenta actualizada.",
          error: (err) => (err instanceof Error ? err.message : "No se pudo actualizar la cuenta."),
        }
      );
    });
  }

  if (status === "PENDING_ONBOARDING") {
    return (
      <Button
        size="sm"
        onClick={() => run("activate", activateOwnerAccount)}
        disabled={isPending}
        isLoading={isPending}
      >
        {!isPending && <UserCheck size={15} strokeWidth={2} />}
        Aprobar cuenta
      </Button>
    );
  }

  if (status === "ACTIVE") {
    return (
      <Button
        size="sm"
        variant="ghost-destructive"
        onClick={() => run("suspend", suspendOwnerAccount)}
        disabled={isPending}
        isLoading={isPending}
      >
        {!isPending && <Ban size={15} strokeWidth={2} />}
        Suspender
      </Button>
    );
  }

  if (status === "SUSPENDED") {
    return (
      <Button
        size="sm"
        variant="secondary"
        onClick={() => run("reactivate", reactivateOwnerAccount)}
        disabled={isPending}
        isLoading={isPending}
      >
        {!isPending && <RotateCcw size={15} strokeWidth={2} />}
        Reactivar
      </Button>
    );
  }

  return null;
}
