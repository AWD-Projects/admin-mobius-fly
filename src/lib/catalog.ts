import { createAdminClient } from "@/lib/supabase/admin";

type CatalogTable =
  | "flight_status"
  | "document_status"
  | "reservation_status"
  | "crew_roles";

// Catalog rows are seeded reference data whose ids never change, so cache them
// for the life of the server instance instead of querying on every request.
const idCache = new Map<string, string>();

export async function getCatalogId(table: CatalogTable, code: string) {
  const key = `${table}:${code}`;
  const cached = idCache.get(key);
  if (cached) return cached;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("code", code)
    .single();

  if (error || !data) {
    throw new Error(`No se encontró el código "${code}" en ${table}.`);
  }

  idCache.set(key, data.id);
  return data.id;
}
