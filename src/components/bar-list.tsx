export function BarList({
  items,
}: {
  items: { label: string; value: number; color: string; href?: string }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => {
        const row = (
          <div className="flex items-center gap-3">
            <div className="flex w-44 shrink-0 items-center gap-1.5 text-sm text-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${Math.max((item.value / max) * 100, item.value > 0 ? 3 : 0)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-sm font-medium text-foreground">
              {item.value}
            </span>
          </div>
        );

        if (item.href) {
          return (
            <a
              key={item.label}
              href={item.href}
              className="rounded-sm -mx-1 px-1 py-0.5 transition-colors hover:bg-muted/40"
            >
              {row}
            </a>
          );
        }

        return <div key={item.label}>{row}</div>;
      })}
    </div>
  );
}
