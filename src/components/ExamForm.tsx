"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { SUBJECTS, EXAM_TYPES } from "@/lib/config/subjects";
import { LESSONS } from "@/lib/config/lessons";
import type { ActionResult } from "@/lib/actions/exams";
import type { ExamDTO } from "@/lib/types";

type ExamFormAction = (prevState: ActionResult | null, formData: FormData) => Promise<ActionResult>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {label}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-danger">{message}</p>;
}

export function ExamForm({
  action,
  initialValues,
  submitLabel,
  successRedirect = "/pruefungen",
}: {
  action: ExamFormAction;
  initialValues?: Partial<ExamDTO>;
  submitLabel: string;
  successRedirect?: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<ActionResult | null, FormData>(action, null);

  useEffect(() => {
    if (state?.success) {
      router.push(successRedirect);
      router.refresh();
    }
  }, [state, router, successRedirect]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5 animate-fade-in">
      {state && !state.success && state.error && !fieldErrors && (
        <p className="flex items-center gap-2 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
          <AlertTriangle size={15} />
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subjectCode" className="mb-1 block text-sm font-medium text-foreground">
            Fach *
          </label>
          <select
            id="subjectCode"
            name="subjectCode"
            defaultValue={initialValues?.subjectCode ?? ""}
            required
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {SUBJECTS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors?.subjectCode} />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-foreground">
            Prüfungsdatum *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={initialValues?.date ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <FieldError message={fieldErrors?.date} />
        </div>

        <div>
          <label htmlFor="lessonStart" className="mb-1 block text-sm font-medium text-foreground">
            Start-Lektion *
          </label>
          <select
            id="lessonStart"
            name="lessonStart"
            required
            defaultValue={initialValues?.lessonStart ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {LESSONS.map((l) => (
              <option key={l.number} value={l.number}>
                {l.number}. Lektion ({l.start} – {l.end})
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors?.lessonStart} />
        </div>

        <div>
          <label htmlFor="lessonEnd" className="mb-1 block text-sm font-medium text-foreground">
            End-Lektion *
          </label>
          <select
            id="lessonEnd"
            name="lessonEnd"
            required
            defaultValue={initialValues?.lessonEnd ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {LESSONS.map((l) => (
              <option key={l.number} value={l.number}>
                {l.number}. Lektion ({l.start} – {l.end})
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors?.lessonEnd} />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
          Titel / Thema *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="z. B. Algebra"
          defaultValue={initialValues?.title ?? ""}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
        <FieldError message={fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-foreground">
          Beschreibung / zusätzliche Informationen
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
          placeholder="Prüfungsstoff, Hilfsmittel, Ablauf …"
          defaultValue={initialValues?.description ?? ""}
          className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
        <FieldError message={fieldErrors?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="examType" className="mb-1 block text-sm font-medium text-foreground">
            Prüfungsart
          </label>
          <select
            id="examType"
            name="examType"
            defaultValue={initialValues?.examType ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="">Keine Angabe</option>
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors?.examType} />
        </div>

        <div>
          <label htmlFor="room" className="mb-1 block text-sm font-medium text-foreground">
            Raum
          </label>
          <input
            id="room"
            name="room"
            type="text"
            maxLength={40}
            placeholder="z. B. B204"
            defaultValue={initialValues?.room ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <FieldError message={fieldErrors?.room} />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-foreground">
          Hinweise
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          maxLength={1000}
          placeholder="z. B. Taschenrechner erlaubt"
          defaultValue={initialValues?.notes ?? ""}
          className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
        <FieldError message={fieldErrors?.notes} />
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-5">
        <SubmitButton label={submitLabel} />
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover cursor-pointer"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
