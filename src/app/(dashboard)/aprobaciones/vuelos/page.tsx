import { ArrowRight, Plane, Clock, PlaneTakeoff, CircleUser, Wallet } from "lucide-react";
import { getPendingFlights } from "@/lib/queue";
import { formatDateTime, formatCurrency } from "@/lib/format";
import { ApprovalActions } from "@/components/approval-actions";
import { DetailField } from "@/components/queue-card";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { approveFlight, rejectFlight } from "@/app/actions/flights";

export default async function AprobacionesVuelosPage() {
  const flights = await getPendingFlights();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Plane}
        title="Vuelos pendientes"
        description="Aprueba o rechaza los vuelos en revisión antes de que se publiquen."
      />

      {flights.length === 0 && <EmptyState label="No hay vuelos pendientes." />}

      <div className="flex flex-col gap-4">
        {flights.map((flight) => (
          <div
            key={flight.id}
            className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-hover)]"
          >
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-4 sm:gap-6">
                <div>
                  <p className="text-2xl leading-none font-bold tracking-[-0.008em] text-foreground">
                    {flight.departure_airport?.iata_code ?? "—"}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {flight.departure_airport?.city ?? "—"}
                  </p>
                </div>
                <ArrowRight size={20} strokeWidth={1.25} className="shrink-0 text-neutral" />
                <div>
                  <p className="text-2xl leading-none font-bold tracking-[-0.008em] text-foreground">
                    {flight.arrival_airport?.iata_code ?? "—"}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {flight.arrival_airport?.city ?? "—"}
                  </p>
                </div>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-sm bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Plane size={12} strokeWidth={2} />
                {flight.flight_code ?? "Sin código"}
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 sm:grid-cols-4">
              <DetailField
                icon={Clock}
                label="Salida"
                value={formatDateTime(flight.departure_datetime)}
              />
              <DetailField
                icon={Clock}
                label="Llegada"
                value={formatDateTime(flight.arrival_datetime)}
              />
              <DetailField
                icon={PlaneTakeoff}
                label="Aeronave"
                value={flight.aircraft?.tail_number ?? "—"}
              />
              <DetailField
                icon={CircleUser}
                label="Owner"
                value={flight.owner?.fleet_name ?? "—"}
              />
              <div className="col-span-2 sm:col-span-4">
                <DetailField
                  icon={Wallet}
                  label="Precio"
                  value={`${formatCurrency(flight.price_per_seat, flight.currency ?? "MXN")} / asiento · ${formatCurrency(flight.price_full_aircraft, flight.currency ?? "MXN")} aeronave completa`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/25 px-5 py-3">
              <ApprovalActions
                id={flight.id}
                itemLabel={`vuelo ${flight.flight_code ?? flight.id}`}
                onApprove={approveFlight}
                onReject={rejectFlight}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
