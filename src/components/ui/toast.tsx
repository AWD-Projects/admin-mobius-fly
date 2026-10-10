"use client";

import { Toaster as SileoToaster, sileo } from "sileo";
import "sileo/styles.css";

// Same toast system and white fill as mobius-fly/components/atoms/Toast.tsx,
// so admin notifications read identically to the owner-facing app.
const TOAST_FILL = "#FFFFFF";

type ToastContent = { title: string; description?: string };

export function ToastProvider() {
  return <SileoToaster position="top-right" theme="dark" options={{ fill: TOAST_FILL }} />;
}

export const toast = {
  success: (title: string, description?: string) =>
    sileo.success({ title, description, fill: TOAST_FILL }),
  error: (title: string, description?: string) =>
    sileo.error({ title, description, fill: TOAST_FILL }),
  /** Resolves/rejects like the wrapped promise, so callers can still catch. */
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: ToastContent;
      success: ToastContent;
      error: (err: unknown) => ToastContent;
    }
  ) =>
    sileo.promise(promise, {
      loading: { ...options.loading, fill: TOAST_FILL },
      success: { ...options.success, fill: TOAST_FILL },
      error: (err: unknown) => ({ ...options.error(err), fill: TOAST_FILL }),
    }),
};
