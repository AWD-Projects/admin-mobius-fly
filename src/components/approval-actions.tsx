"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const rejectSchema = z.object({
  reason: z.string().trim().min(1, "El motivo de rechazo es obligatorio."),
});
type RejectValues = z.infer<typeof rejectSchema>;

type ActionResult = { success?: true; error?: string };

async function runAction(promise: Promise<ActionResult>) {
  const result = await promise;
  if (result.error) throw new Error(result.error);
  return result;
}

export function ApprovalActions({
  id,
  itemLabel,
  onApprove,
  onReject,
}: {
  id: string;
  itemLabel: string;
  onApprove: (id: string) => Promise<ActionResult>;
  onReject: (id: string, reason: string) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [isApproving, startApprove] = useTransition();
  const [isRejecting, startReject] = useTransition();

  const form = useForm<RejectValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  function handleApprove() {
    startApprove(async () => {
      await toast.promise(runAction(onApprove(id)), {
        loading: `Aprobando ${itemLabel}…`,
        success: `Aprobado: ${itemLabel}`,
        error: (err) => (err instanceof Error ? err.message : "No se pudo aprobar."),
      });
    });
  }

  function handleReject(values: RejectValues) {
    startReject(async () => {
      try {
        await toast.promise(runAction(onReject(id, values.reason)), {
          loading: `Rechazando ${itemLabel}…`,
          success: `Rechazado: ${itemLabel}`,
          error: (err) => (err instanceof Error ? err.message : "No se pudo rechazar."),
        });
        setOpen(false);
        form.reset();
      } catch {
        // toast.promise already surfaced the error; keep the dialog open to retry.
      }
    });
  }

  const isPending = isApproving || isRejecting;

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={handleApprove} disabled={isPending} isLoading={isApproving}>
        {!isApproving && <Check size={15} strokeWidth={2} />}
        Aprobar
      </Button>
      <Button
        size="sm"
        variant="ghost-destructive"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <X size={15} strokeWidth={2} />
        Rechazar
      </Button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) form.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                <ShieldAlert size={18} strokeWidth={1.75} />
              </div>
              <DialogTitle>Rechazar {itemLabel}</DialogTitle>
            </div>
            <DialogDescription>
              Indica el motivo de rechazo antes de confirmar.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleReject)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe el motivo del rechazo..."
                        disabled={isRejecting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isRejecting}
                  isLoading={isRejecting}
                >
                  {!isRejecting && <X size={15} strokeWidth={2} />}
                  Confirmar rechazo
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
