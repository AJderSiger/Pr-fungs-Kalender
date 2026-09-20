"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { SUBJECTS, EXAM_TYPES } from "@/lib/config/subjects";
import { LESSONS, DURATION_OPTIONS_MINUTES } from "@/lib/config/lessons";
import { getDefaultTeacherForSubject, MORNING_PRIORITY_SUBJECTS, DEFAULT_ROOM } from "@/lib/config/teachers";
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

function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} Minuten`;
  if (minutes % 60 === 0) return `${minutes} Minuten (${minutes / 60} Std.)`;
  return `${minutes} Minuten (${Math.floor(minutes / 60)} Std. ${minutes % 60} Min.)`;
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

  const [subjectCode, setSubjectCode] = useState(initialValues?.subjectCode ?? "");
  const [lessonStart, setLessonStart] = useState(initialValues?.lessonStart?.toString() ?? "");
  const [teacherName, setTeacherName] = useState(initialValues?.teacherName ?? "");
  const [lessonTouched, setLessonTouched] = useState(Boolean(initialValues?.lessonStart));
  const [teacherTouched, setTeacherTouched] = useState(Boolean(initialValues?.teacherName));

  useEffect(() => {
    if (state?.success) {
      router.push(successRedirect);
      router.refresh();
    }
  }, [state, router, successRedirect]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;

  function handleSubjectChange(code: string) {
    setSubjectCode(code);
    if (!teacherTouched) {
      setTeacherName(getDefaultTeacherForSubject(code));
    }
    if (!lessonTouched && MORNING_PRIORITY_SUBJECTS.includes(code)) {
      setLessonStart("1");
    }
  }

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
            value={subjectCode}
            onChange={(e) => handleSubjectChange(e.target.value)}
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
            value={lessonStart}
            onChange={(e) => {
              setLessonStart(e.target.value);
              setLessonTouched(true);
            }}
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
          <label htmlFor="durationMinutes" className="mb-1 block text-sm font-medium text-foreground">
            Prüfungsdauer *
          </label>
          <select
            id="durationMinutes"
            name="durationMinutes"
            required
            defaultValue={initialValues?.durationMinutes ?? 45}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            {DURATION_OPTIONS_MINUTES.map((minutes) => (
              <option key={minutes} value={minutes}>
                {formatDurationLabel(minutes)}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors?.durationMinutes} />
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
            Raum *
          </label>
          <input
            id="room"
            name="room"
            type="text"
            required
            maxLength={40}
            placeholder="z. B. 403"
            defaultValue={initialValues?.room ?? DEFAULT_ROOM}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <FieldError message={fieldErrors?.room} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="teacherName" className="mb-1 block text-sm font-medium text-foreground">
            Lehrperson *
          </label>
          <input
            id="teacherName"
            name="teacherName"
            type="text"
            required
            maxLength={80}
            placeholder="z. B. Susanne Stolle"
            value={teacherName}
            onChange={(e) => {
              setTeacherName(e.target.value);
              setTeacherTouched(true);
            }}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
          <FieldError message={fieldErrors?.teacherName} />
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
