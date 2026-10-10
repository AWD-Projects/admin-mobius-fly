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
      <div className="flex w-full max-w-[356px] flex-col items-center">
        {/* main-logo.svg is #39424E: it must sit on the light background, never on a dark tile */}
        <div className="mb-12 flex items-center gap-2">
          <Image
            src="/logo/main-logo.svg"
            alt="Mobius Fly"
            width={32}
            height={32}
            priority
            className="size-8"
          />
          <span className="text-xl font-medium text-foreground">Mobius Fly</span>
        </div>
        <h1 className="mb-2 text-center text-[2rem] font-bold text-foreground">
          Panel interno
        </h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Acceso exclusivo del equipo de Mobius Fly.
        </p>
        {params.error === "not_admin" && (
          <p className="mb-4 flex w-full items-start gap-2 rounded-sm bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <ShieldAlert size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
            Esta cuenta no tiene acceso al panel de administración.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
