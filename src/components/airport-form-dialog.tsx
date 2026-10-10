"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
import { Pencil, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { createAirport, updateAirport } from "@/app/actions/airports";
import { airportSchema, type AirportFormValues } from "@/lib/validations/airport";

export type AirportRecord = {
  id: string;
  iata_code: string;
  icao_code: string | null;
  name: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

const EMPTY_VALUES: AirportFormValues = {
  iata_code: "",
  icao_code: "",
  name: "",
  city: "",
  state: "",
  country: "México",
  latitude: "",
  longitude: "",
};

function toFormValues(airport: AirportRecord): AirportFormValues {
  return {
    iata_code: airport.iata_code,
    icao_code: airport.icao_code ?? "",
    name: airport.name,
    city: airport.city,
    state: airport.state ?? "",
    country: airport.country,
    latitude: airport.latitude === null ? "" : String(airport.latitude),
    longitude: airport.longitude === null ? "" : String(airport.longitude),
  };
}

const FIELDS: {
  name: keyof AirportFormValues;
  label: string;
  placeholder: string;
  className?: string;
  inputMode?: "decimal";
  maxLength?: number;
}[] = [
  { name: "iata_code", label: "Código IATA", placeholder: "MEX", maxLength: 3 },
  { name: "icao_code", label: "Código ICAO (opcional)", placeholder: "MMMX", maxLength: 4 },
  { name: "name", label: "Nombre", placeholder: "Aeropuerto Internacional Benito Juárez", className: "sm:col-span-2" },
  { name: "city", label: "Ciudad", placeholder: "Ciudad de México" },
  { name: "state", label: "Estado (opcional)", placeholder: "CDMX" },
  { name: "country", label: "País", placeholder: "México", className: "sm:col-span-2" },
  { name: "latitude", label: "Latitud", placeholder: "19.4363", inputMode: "decimal" },
  { name: "longitude", label: "Longitud", placeholder: "-99.0721", inputMode: "decimal" },
];

export function AirportFormDialog({ airport }: { airport?: AirportRecord }) {
  const isEditing = !!airport;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AirportFormValues>({
    resolver: zodResolver(airportSchema),
    defaultValues: airport ? toFormValues(airport) : EMPTY_VALUES,
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) form.reset(airport ? toFormValues(airport) : EMPTY_VALUES);
  }

  function onSubmit(values: AirportFormValues) {
    startTransition(async () => {
      const result = isEditing
        ? await updateAirport(airport.id, values)
        : await createAirport(values);

      if (result.error) {
        toast.error(isEditing ? "No se pudo actualizar" : "No se pudo crear", result.error);
        return;
      }
      toast.success(isEditing ? "Aeropuerto actualizado" : "Aeropuerto creado");
      setOpen(false);
    });
  }

  return (
    <>
      {isEditing ? (
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Editar ${airport.iata_code}`}
          onClick={() => handleOpenChange(true)}
        >
          <Pencil size={15} strokeWidth={2} />
        </Button>
      ) : (
        <Button size="sm" onClick={() => handleOpenChange(true)}>
          <Plus size={15} strokeWidth={2} />
          Nuevo aeropuerto
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Editar ${airport.iata_code}` : "Nuevo aeropuerto"}
            </DialogTitle>
            <DialogDescription>
              El código IATA debe ser único. Los propietarios usan este catálogo para crear vuelos.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid items-start gap-4 sm:grid-cols-2">
                {FIELDS.map((spec) => (
                  <FormField
                    key={spec.name}
                    control={form.control}
                    name={spec.name}
                    render={({ field }) => (
                      <FormItem className={spec.className}>
                        <FormLabel>{spec.label}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={spec.placeholder}
                            inputMode={spec.inputMode}
                            maxLength={spec.maxLength}
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending} isLoading={isPending}>
                  {isEditing ? "Guardar cambios" : "Crear aeropuerto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
