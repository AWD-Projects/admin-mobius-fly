"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      size="sm"
      disabled={pending}
      isLoading={pending}
      className="border-transparent text-secondary hover:border-transparent hover:bg-destructive/8 hover:text-destructive"
    >
      {!pending && <LogOut size={16} strokeWidth={1.75} />}
      {pending ? "Cerrando sesión…" : "Cerrar sesión"}
    </Button>
  );
}
