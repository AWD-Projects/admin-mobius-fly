import Image from "next/image";
import { logout } from "@/app/actions/auth";
import { LogoutButton } from "@/components/logout-button";
import { SidebarNav } from "@/components/sidebar-nav";
import { createClient } from "@/lib/supabase/server";
import { getQueueCounts } from "@/lib/queue";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    counts,
  ] = await Promise.all([supabase.auth.getUser(), getQueueCounts()]);

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-[260px] shrink-0 flex-col bg-sidebar p-6 text-sidebar-foreground">
        <div className="mb-8 flex items-center gap-2.5">
          <Image
            src="/logo/mobiuswhite-logo.svg"
            alt="Mobius Fly"
            width={28}
            height={28}
            className="shrink-0"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-[-0.008em]">Mobius Admin</span>
            <span className="text-[11px] text-sidebar-foreground/50">Panel interno</span>
          </div>
        </div>
        <SidebarNav counts={counts} />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[72px] shrink-0 items-center justify-end border-b border-border px-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <form action={logout}>
              <LogoutButton />
            </form>
          </div>
        </header>
        <main className="flex-1 bg-background p-8">{children}</main>
      </div>
    </div>
  );
}
