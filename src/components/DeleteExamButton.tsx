"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, X, Check } from "lucide-react";
import { deleteExam } from "@/lib/actions/exams";

export function DeleteExamButton({ examId, examTitle }: { examId: string; examTitle: string }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-2 py-1.5 text-xs animate-fade-in">
        <span className="text-danger">Wirklich löschen?</span>
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await deleteExam(examId);
              if (!result.success) {
                setError(result.error);
                setConfirming(false);
              }
            })
          }
          className="flex items-center gap-1 rounded-md bg-danger px-2 py-1 font-medium text-white cursor-pointer disabled:opacity-60"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Ja
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-foreground cursor-pointer"
        >
          <X size={12} />
          Nein
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        title={`"${examTitle}" löschen`}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-soft cursor-pointer"
      >
        <Trash2 size={13} />
        Löschen
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
