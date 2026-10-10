import { MapPin, Search } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearch } from "@/lib/search";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AirportFormDialog } from "@/components/airport-form-dialog";
import { AirportDeleteButton } from "@/components/airport-delete-button";

const PAGE_SIZE = 20;

async function getAirports(search: string, page: number) {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("airports")
    .select(
      "id, iata_code, icao_code, name, city, state, country, latitude, longitude",
      { count: "exact" }
    )
    .order("iata_code", { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  if (search) {
    query = query.or(
      `iata_code.ilike.%${search}%,name.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  const { data, count } = await query;
  const airports = data ?? [];

  const usage = new Map<string, number>();
  if (airports.length) {
    const ids = airports.map((airport) => airport.id);
    const idList = `(${ids.join(",")})`;
    const { data: flights } = await supabase
      .from("flights")
      .select("departure_airport_id, arrival_airport_id")
      .or(`departure_airport_id.in.${idList},arrival_airport_id.in.${idList}`);

    for (const flight of flights ?? []) {
      for (const id of [flight.departure_airport_id, flight.arrival_airport_id]) {
        if (ids.includes(id)) usage.set(id, (usage.get(id) ?? 0) + 1);
      }
    }
  }

  return {
    airports: airports.map((airport) => ({
      ...airport,
      flightCount: usage.get(airport.id) ?? 0,
    })),
    total: count ?? 0,
  };
}

export default async function AeropuertosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = sanitizeSearch(params.q ?? "");
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const { airports, total } = await getAirports(search, page);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          icon={MapPin}
          title="Aeropuertos"
          description="Catálogo que los propietarios usan para crear vuelos."
        />
        <AirportFormDialog />
      </div>

      <form className="relative max-w-sm">
        <Search
          size={15}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/70"
        />
        <Input
          type="search"
          name="q"
          placeholder="Buscar por IATA, nombre o ciudad..."
          defaultValue={search}
          className="pl-9"
        />
      </form>

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IATA</TableHead>
              <TableHead>ICAO</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Coordenadas</TableHead>
              <TableHead>Vuelos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {airports.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No se encontraron aeropuertos.
                </TableCell>
              </TableRow>
            )}
            {airports.map((airport) => (
              <TableRow key={airport.id}>
                <TableCell className="font-semibold">{airport.iata_code}</TableCell>
                <TableCell className="text-muted-foreground">{airport.icao_code ?? "—"}</TableCell>
                <TableCell>{airport.name}</TableCell>
                <TableCell>
                  {airport.city}
                  <span className="text-muted-foreground">
                    {airport.state ? `, ${airport.state}` : ""}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {airport.latitude !== null && airport.longitude !== null
                    ? `${airport.latitude}, ${airport.longitude}`
                    : "—"}
                </TableCell>
                <TableCell className="tabular-nums">{airport.flightCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <AirportFormDialog airport={airport} />
                    <AirportDeleteButton airportId={airport.id} label={airport.iata_code} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        basePath="/aeropuertos"
        params={{ q: search }}
        page={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
