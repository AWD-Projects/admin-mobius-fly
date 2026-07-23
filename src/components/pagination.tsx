import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const showEllipsis = totalPages > 7;

  if (!showEllipsis) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (currentPage <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("...");
    pages.push(currentPage - 1, currentPage, currentPage + 1);
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  basePath,
  params,
  page,
  totalPages,
  totalItems,
  pageSize,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}) {
  if (totalItems === 0) return null;

  function hrefFor(targetPage: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (targetPage > 1) search.set("page", String(targetPage));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{start}–{end}</span> de{" "}
        <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      <nav
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Paginación"
      >
        <PageArrow direction="prev" href={canGoPrevious ? hrefFor(page - 1) : undefined} />

        {getPageNumbers(page, totalPages).map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-1.5 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={hrefFor(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-sm px-1.5 text-sm transition-colors",
                item === page
                  ? "font-semibold text-primary underline underline-offset-4"
                  : "text-secondary hover:bg-muted/40 hover:text-foreground"
              )}
            >
              {item}
            </Link>
          )
        )}

        <PageArrow direction="next" href={canGoNext ? hrefFor(page + 1) : undefined} />
      </nav>
    </div>
  );
}

function PageArrow({ direction, href }: { direction: "prev" | "next"; href?: string }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Página anterior" : "Página siguiente";

  const className = cn(
    "flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors",
    href ? "hover:bg-muted/40 hover:text-foreground" : "pointer-events-none opacity-30"
  );

  if (!href) {
    return (
      <span className={className} aria-hidden="true">
        <Icon size={16} strokeWidth={2} />
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className}>
      <Icon size={16} strokeWidth={2} />
    </Link>
  );
}
