import { createAdminClient } from "@/lib/supabase/admin";
import { getQueueCounts } from "@/lib/queue";

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const [queueCounts, owners, totalFlights, totalAircrafts, activeCrew] =
    await Promise.all([
      getQueueCounts(),
      supabase.from("owners").select("status"),
      supabase.from("flights").select("id", { count: "exact", head: true }),
      supabase.from("aircrafts").select("id", { count: "exact", head: true }),
      supabase
        .from("crew_members")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", true),
    ]);

  const ownersByStatus = { PENDING_ONBOARDING: 0, ACTIVE: 0, SUSPENDED: 0 };
  for (const owner of owners.data ?? []) {
    if (owner.status in ownersByStatus) {
      ownersByStatus[owner.status as keyof typeof ownersByStatus]++;
    }
  }

  return {
    queueCounts,
    ownersByStatus,
    totalOwners: owners.data?.length ?? 0,
    totalFlights: totalFlights.count ?? 0,
    totalAircrafts: totalAircrafts.count ?? 0,
    activeCrew: activeCrew.count ?? 0,
  };
}
