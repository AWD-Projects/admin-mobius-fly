import { createClient } from "@/lib/supabase/server";

/**
 * Server actions are publicly addressable POST endpoints, so each one must
 * re-check that the caller is an admin instead of trusting the page that
 * rendered the form. Reads the caller's own `admin_users` row through RLS.
 */
export async function requireAdmin(): Promise<{ error: string } | { userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!adminUser) return { error: "No tienes permisos de administrador." };

  return { userId: user.id };
}
