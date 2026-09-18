import type { ReactNode } from "react";
import { CalendarX2 } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center animate-fade-in">
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
        <CalendarX2 size={22} />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}
