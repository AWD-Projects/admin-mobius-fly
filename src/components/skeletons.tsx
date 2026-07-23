import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-11 shrink-0 rounded-md" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

export function QueueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3.5 p-5">
        <Skeleton className="size-11 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <div className="h-px bg-border" />
      <div className="grid grid-cols-2 gap-4 px-5 py-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/25 px-5 py-3">
        <Skeleton className="h-9 w-24 rounded-sm" />
        <Skeleton className="h-9 w-24 rounded-sm" />
      </div>
    </div>
  );
}

export function QueueListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <QueueCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border p-4">
        <div className="flex gap-6">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-6 p-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatTileSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <Skeleton className="size-11 shrink-0 rounded-md" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
