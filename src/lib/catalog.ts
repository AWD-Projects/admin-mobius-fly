import { createAdminClient } from "@/lib/supabase/admin";

type CatalogTable =
  | "flight_status"
  | "document_status"
  | "reservation_status"
  | "crew_roles";

export async function getCatalogId(table: CatalogTable, code: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("code", code)
    .single();

  if (error || !data) {
    throw new Error(`No se encontró el código "${code}" en ${table}.`);
  }

  return data.id;
}
