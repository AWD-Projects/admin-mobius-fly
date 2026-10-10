import Link from "next/link";
import { PlaneTakeoff, Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearch } from "@/lib/search";
import { formatDateTime } from "@/lib/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";

const PAGE_SIZE = 20;

const FLIGHT_STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "Programado",
  ON_TIME: "A tiempo",
  DELAYED: "Retrasado",
  IN_FLIGHT: "En vuelo",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  PENDING_REVIEW: "En revisión",
  REJECTED: "Rechazado",
};

async function getFlights(search: string, statusId: string | null, page: number) {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("flights")
    .select(
      `id, flight_code, departure_datetime, arrival_datetime, is_visible,
       aircraft:aircrafts(id, tail_number, model),
       owner:owners(fleet_name),
       departure_airport:airports!flights_departure_airport_id_fkey(iata_code),
       arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code),
       flight_status(code, name)`,
      { count: "exact" }
    )
    .order("departure_datetime", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.ilike("flight_code", `%${search}%`);
  }
  if (statusId) {
    query = query.eq("status_id", statusId);
  }

  const { data, count } = await query;
  if (!data) return { flights: [], total: 0 };

  const uniqueAircraftIds = Array.from(
    new Set(data.map((flight) => flight.aircraft?.id).filter(Boolean))
  ) as string[];

  const docsApprovedByAircraft = new Map<string, boolean>();
  await Promise.all(
    uniqueAircraftIds.map(async (aircraftId) => {
      const { data: allApproved } = await supabase.rpc(
        "aircraft_has_all_docs_approved",
        { p_aircraft_id: aircraftId }
      );
      docsApprovedByAircraft.set(aircraftId, allApproved ?? false);
    })
  );

  return {
    flights: data.map((flight) => ({
      ...flight,
      aircraftDocsApproved: flight.aircraft?.id
        ? (docsApprovedByAircraft.get(flight.aircraft.id) ?? false)
        : false,
    })),
    total: count ?? 0,
  };
}

export default async function VuelosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = sanitizeSearch(params.q ?? "");
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const { data: statuses } = await createAdminClient()
    .from("flight_status")
    .select("id, code, name")
    .order("name");
  const statusOptions = statuses ?? [];
  const selectedStatus = statusOptions.find((status) => status.code === params.status);

  const { flights, total } = await getFlights(search, selectedStatus?.id ?? null, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={PlaneTakeoff}
        title="Todos los vuelos"
        description="Consulta de soporte, solo lectura."
      />

      <form className="flex flex-wrap items-end gap-4">
        <div className="flex w-full max-w-sm flex-col gap-1.5">
          <label htmlFor="q" className="text-xs font-semibold text-muted-foreground">
            Código de vuelo
          </label>
          <div className="relative">
            <Search
              size={15}
              strokeWidth={2}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/70"
            />
            <Input
              id="q"
              type="search"
              name="q"
              placeholder="Buscar por código de vuelo..."
              defaultValue={search}
              className="h-9 pl-9"
            />
          </div>
        </div>
        <div className="flex w-[180px] flex-col gap-1.5">
          <label htmlFor="status" className="text-xs font-semibold text-muted-foreground">
            Estado
          </label>
          <NativeSelect
            id="status"
            name="status"
            defaultValue={selectedStatus?.code ?? ""}
            className="h-9"
          >
            <option value="">Todos los estados</option>
            {statusOptions.map((status) => (
              <option key={status.id} value={status.code}>
                {FLIGHT_STATUS_LABEL[status.code] ?? status.name}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Filtrar
        </Button>
        {(search || selectedStatus) && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/vuelos">Limpiar</Link>
          </Button>
        )}
      </form>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vuelo</TableHead>
              <TableHead>Ruta</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Aeronave</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Aeronave lista</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flights.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No se encontraron vuelos.
                </TableCell>
              </TableRow>
            )}
            {flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff size={14} strokeWidth={1.75} className="text-muted-foreground/70" />
                    {flight.flight_code ?? "—"}
                  </div>
                </TableCell>
                <TableCell>
                  {flight.departure_airport?.iata_code ?? "—"} →{" "}
                  {flight.arrival_airport?.iata_code ?? "—"}
                </TableCell>
                <TableCell>{formatDateTime(flight.departure_datetime)}</TableCell>
                <TableCell>{flight.aircraft?.tail_number ?? "—"}</TableCell>
                <TableCell>{flight.owner?.fleet_name ?? "—"}</TableCell>
                <TableCell>
                  {flight.flight_status && (
                    <StatusBadge
                      code={flight.flight_status.code}
                      label={
                        FLIGHT_STATUS_LABEL[flight.flight_status.code] ??
                        flight.flight_status.name
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    code={flight.is_visible ? "YES" : "NO"}
                    label={flight.is_visible ? "Sí" : "No"}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge
                    code={flight.aircraftDocsApproved ? "YES" : "NO"}
                    label={flight.aircraftDocsApproved ? "Sí" : "No"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        basePath="/vuelos"
        params={{ q: search || undefined, status: selectedStatus?.code }}
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
