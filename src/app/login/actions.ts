"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type LoginValues = { email: string; password: string };

export async function login(values: LoginValues) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword(values);
  if (error || !data.user) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    return { error: "Esta cuenta no tiene acceso al panel de administración." };
  }

  redirect("/");
}
