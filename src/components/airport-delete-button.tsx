"use client";

import { useState, useTransition } from "react";
import { toast } from "@/components/ui/toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAirport } from "@/app/actions/airports";

export function AirportDeleteButton({
  airportId,
  label,
}: {
  airportId: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAirport(airportId);
      if (result.error) {
        // Keep the dialog open so the reason (e.g. which flights use it) stays visible.
        toast.error("No se pudo eliminar", result.error);
        return;
      }
      toast.success("Aeropuerto eliminado", `${label} se eliminó del catálogo.`);
      setOpen(false);
    });
  }

  return (
    <>
      <Button
        size="icon-sm"
        variant="ghost-destructive"
        aria-label={`Eliminar ${label}`}
        onClick={() => setOpen(true)}
      >
        <Trash2 size={15} strokeWidth={2} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar {label}</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Si algún vuelo usa este aeropuerto, no se eliminará.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              isLoading={isPending}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
