import { createAdminClient } from "@/lib/supabase/admin";
import { getCatalogId } from "@/lib/catalog";

export async function getPendingFlights() {
  const supabase = createAdminClient();
  const pendingReviewId = await getCatalogId("flight_status", "PENDING_REVIEW");

  const { data } = await supabase
    .from("flights")
    .select(
      `id, flight_code, departure_datetime, arrival_datetime, price_per_seat, price_full_aircraft, currency,
       aircraft:aircrafts(tail_number, model),
       owner:owners(fleet_name),
       departure_airport:airports!flights_departure_airport_id_fkey(iata_code, city),
       arrival_airport:airports!flights_arrival_airport_id_fkey(iata_code, city)`
    )
    .eq("status_id", pendingReviewId)
    .order("departure_datetime", { ascending: true });

  return data ?? [];
}

export async function getPendingOwnerDocuments() {
  const supabase = createAdminClient();
  const pendingDocId = await getCatalogId("document_status", "PENDING_REVIEW");

  const { data } = await supabase
    .from("user_documents")
    .select(
      `id, document_type, document_url, created_at,
       user_profile:user_profiles!inner(first_name, last_name, role)`
    )
    .eq("document_status_id", pendingDocId)
    .eq("user_profile.role", "OWNER")
    .order("created_at", { ascending: true });

  if (!data) return [];

  // user_documents.document_url is a private storage path (not aircraft_documents,
  // which already stores a long-lived signed URL) — sign it for display here.
  return Promise.all(
    data.map(async (doc) => {
      const { data: signed } = await supabase.storage
        .from("identity-documents")
        .createSignedUrl(doc.document_url, 60 * 10);
      return { ...doc, signedDocumentUrl: signed?.signedUrl ?? null };
    })
  );
}

export async function getPendingAircraftDocuments() {
  const supabase = createAdminClient();
  const pendingDocId = await getCatalogId("document_status", "PENDING_REVIEW");

  const { data } = await supabase
    .from("aircraft_documents")
    .select(
      `id, document_type, document_url, created_at,
       aircraft:aircrafts(tail_number, model, owner:owners(fleet_name))`
    )
    .eq("document_status_id", pendingDocId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function getPendingCrewMembers() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("crew_members")
    .select(
      `id, first_name, last_name, email, phone, license_number,
       crew_role:crew_roles(name),
       owner:owners(fleet_name)`
    )
    .eq("is_approved", false)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function getQueueCounts() {
  const supabase = createAdminClient();
  const [pendingReviewFlightId, pendingReviewDocId] = await Promise.all([
    getCatalogId("flight_status", "PENDING_REVIEW"),
    getCatalogId("document_status", "PENDING_REVIEW"),
  ]);

  const [flights, ownerDocs, aircraftDocs, crew] = await Promise.all([
    supabase
      .from("flights")
      .select("id", { count: "exact", head: true })
      .eq("status_id", pendingReviewFlightId),
    supabase
      .from("user_documents")
      .select("id, user_profile:user_profiles!inner(role)", {
        count: "exact",
        head: true,
      })
      .eq("document_status_id", pendingReviewDocId)
      .eq("user_profile.role", "OWNER"),
    supabase
      .from("aircraft_documents")
      .select("id", { count: "exact", head: true })
      .eq("document_status_id", pendingReviewDocId),
    supabase
      .from("crew_members")
      .select("id", { count: "exact", head: true })
      .eq("is_approved", false),
  ]);

  return {
    flights: flights.count ?? 0,
    ownerDocuments: ownerDocs.count ?? 0,
    aircraftDocuments: aircraftDocs.count ?? 0,
    crew: crew.count ?? 0,
  };
}
