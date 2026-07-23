import Image from "next/image";
import { ShieldAlert } from "lucide-react";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-secondary">
            <Image src="/logo/main-logo.svg" alt="Mobius Fly" width={24} height={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-[-0.008em] text-foreground">
              Mobius Admin
            </h1>
            <p className="text-sm text-muted-foreground">Panel interno de aprobación</p>
          </div>
        </div>
        {params.error === "not_admin" && (
          <p className="mb-4 flex items-start gap-2 rounded-sm bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <ShieldAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
            Esta cuenta no tiene acceso al panel de administración.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
