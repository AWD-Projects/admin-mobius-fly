"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  airportSchema,
  toAirportRow,
  type AirportFormValues,
} from "@/lib/validations/airport";

type ActionResult = { success?: true; error?: string };

const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";

function duplicateIataMessage(iata: string) {
  return `Ya existe un aeropuerto con el código IATA ${iata}.`;
}

function revalidateAirports() {
  revalidatePath("/aeropuertos");
  revalidatePath("/vuelos");
}

export async function createAirport(values: AirportFormValues): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const parsed = airportSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const row = toAirportRow(parsed.data);

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("airports")
    .select("id")
    .eq("iata_code", row.iata_code)
    .maybeSingle();
  if (existing) return { error: duplicateIataMessage(row.iata_code) };

  const { error } = await supabase.from("airports").insert(row);
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { error: duplicateIataMessage(row.iata_code) };
    return { error: "No se pudo crear el aeropuerto." };
  }

  revalidateAirports();
  return { success: true };
}

export async function updateAirport(
  airportId: string,
  values: AirportFormValues
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const parsed = airportSchema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const row = toAirportRow(parsed.data);

  const supabase = createAdminClient();
  const { data: duplicate } = await supabase
    .from("airports")
    .select("id")
    .eq("iata_code", row.iata_code)
    .neq("id", airportId)
    .maybeSingle();
  if (duplicate) return { error: duplicateIataMessage(row.iata_code) };

  const { data, error } = await supabase
    .from("airports")
    .update(row)
    .eq("id", airportId)
    .select("id");
  if (error) {
    if (error.code === UNIQUE_VIOLATION) return { error: duplicateIataMessage(row.iata_code) };
    return { error: "No se pudo actualizar el aeropuerto." };
  }
  if (!data?.length) return { error: "Aeropuerto no encontrado." };

  revalidateAirports();
  return { success: true };
}

/**
 * Only flights reference airports in the live schema (departure/arrival FKs);
 * `aircrafts` has no `home_airport_id`, contrary to PRD RN06. If that column
 * is ever added, count it here too.
 */
export async function deleteAirport(airportId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return { error: auth.error };

  const supabase = createAdminClient();

  const [departures, arrivals] = await Promise.all([
    supabase
      .from("flights")
      .select("id", { count: "exact", head: true })
      .eq("departure_airport_id", airportId),
    supabase
      .from("flights")
      .select("id", { count: "exact", head: true })
      .eq("arrival_airport_id", airportId),
  ]);
  if (departures.error || arrivals.error) {
    return { error: "No se pudo verificar el uso del aeropuerto." };
  }

  const asOrigin = departures.count ?? 0;
  const asDestination = arrivals.count ?? 0;
  if (asOrigin + asDestination > 0) {
    const parts: string[] = [];
    if (asOrigin) parts.push(`${asOrigin} vuelo${asOrigin === 1 ? "" : "s"} como origen`);
    if (asDestination) {
      parts.push(`${asDestination} vuelo${asDestination === 1 ? "" : "s"} como destino`);
    }
    return { error: `No se puede eliminar: lo usan ${parts.join(" y ")}.` };
  }

  const { error } = await supabase.from("airports").delete().eq("id", airportId);
  if (error) {
    if (error.code === FOREIGN_KEY_VIOLATION) {
      return { error: "No se puede eliminar: el aeropuerto está en uso por otros registros." };
    }
    return { error: "No se pudo eliminar el aeropuerto." };
  }

  revalidateAirports();
  return { success: true };
}
