import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function EmptyState({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <CheckCircle2 size={28} strokeWidth={1.5} className="text-success" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
