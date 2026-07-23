import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatTileSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
          >
            <Skeleton className="h-4 w-40" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-32 shrink-0" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3.5 w-6 shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
