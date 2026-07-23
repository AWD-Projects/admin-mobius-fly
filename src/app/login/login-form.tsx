"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { login } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await login(values);
      if (result?.error) setServerError(result.error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail
                    size={15}
                    strokeWidth={2}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/70"
                  />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="nombre@amoxtli.tech"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock
                    size={15}
                    strokeWidth={2}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground/70"
                  />
                  <Input
                    type="password"
                    autoComplete="current-password"
                    className="pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="flex items-start gap-2 rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle size={15} strokeWidth={2} className="mt-0.5 shrink-0" />
            {serverError}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          isLoading={isPending}
          className="mt-2"
        >
          {!isPending && <LogIn size={16} strokeWidth={2} />}
          {isPending ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
    </Form>
  );
}
