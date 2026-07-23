import { CircleUser, Mail, Phone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { OwnerActions } from "@/components/owner-actions";
import { PageHeader } from "@/components/page-header";

const OWNER_STATUS_LABEL: Record<string, string> = {
  PENDING_ONBOARDING: "Onboarding pendiente",
  ACTIVE: "Activo",
  SUSPENDED: "Suspendido",
};

async function getOwners() {
  const supabase = createAdminClient();

  const { data: owners } = await supabase
    .from("owners")
    .select(
      `id, fleet_name, status, user_id,
       user_profile:user_profiles(first_name, last_name, phone)`
    )
    .order("created_at", { ascending: false });

  if (!owners) return [];

  const withEmail = await Promise.all(
    owners.map(async (owner) => {
      const { data } = await supabase.auth.admin.getUserById(owner.user_id);
      return { ...owner, email: data.user?.email ?? "—" };
    })
  );

  return withEmail;
}

export default async function OwnersPage() {
  const owners = await getOwners();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={CircleUser}
        title="Owners"
        description="Cuentas de propietarios de aeronaves registradas en Mobius Fly."
      />

      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Fleet</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay owners registrados.
                </TableCell>
              </TableRow>
            )}
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                      <CircleUser size={16} strokeWidth={1.75} />
                    </div>
                    {owner.user_profile?.first_name} {owner.user_profile?.last_name}
                  </div>
                </TableCell>
                <TableCell>{owner.fleet_name ?? "—"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} strokeWidth={2} className="text-muted-foreground/70" />
                      {owner.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone size={12} strokeWidth={2} className="text-muted-foreground/70" />
                      {owner.user_profile?.phone ?? "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    code={owner.status}
                    label={OWNER_STATUS_LABEL[owner.status] ?? owner.status}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <OwnerActions ownerId={owner.id} status={owner.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
