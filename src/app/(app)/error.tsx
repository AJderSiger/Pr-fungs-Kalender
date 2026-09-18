"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle size={22} />
      </div>
      <p className="font-medium text-foreground">Etwas ist schiefgelaufen</p>
      <p className="max-w-sm text-sm text-muted">
        Die Seite konnte nicht geladen werden. Bitte versuche es erneut.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-2 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover cursor-pointer"
      >
        <RotateCcw size={15} />
        Erneut versuchen
      </button>
    </div>
  );
}
