"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw, CalendarClock } from "lucide-react";
import { SUBJECTS } from "@/lib/config/subjects";
import type { ExamDTO } from "@/lib/types";
import { ExamCard } from "@/components/ExamCard";
import { EmptyState } from "@/components/EmptyState";
import { isDateInIsoWeek } from "@/lib/week";

export function ExamExplorer({
  exams,
  teachers,
  canManage,
}: {
  exams: ExamDTO[];
  teachers: string[];
  canManage: boolean;
}) {
  const [subjectCode, setSubjectCode] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [date, setDate] = useState("");
  const [week, setWeek] = useState("");
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const filtered = useMemo(() => {
    return exams.filter((exam) => {
      if (subjectCode && exam.subjectCode !== subjectCode) return false;
      if (teacherName && exam.teacherName !== teacherName) return false;
      if (date && exam.date !== date) return false;
      if (week && !isDateInIsoWeek(exam.date, week)) return false;
      if (upcomingOnly && exam.date < todayIso) return false;
      return true;
    });
  }, [exams, subjectCode, teacherName, date, week, upcomingOnly, todayIso]);

  const hasActiveFilters = subjectCode || teacherName || date || week || upcomingOnly;

  function resetFilters() {
    setSubjectCode("");
    setTeacherName("");
    setDate("");
    setWeek("");
    setUpcomingOnly(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter size={16} className="text-primary" />
            Filter
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-medium text-muted transition hover:text-primary cursor-pointer"
            >
              <RotateCcw size={13} />
              Zurücksetzen
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Fach
            <select
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Alle Fächer</option>
              {SUBJECTS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Lehrer
            <select
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Alle Lehrpersonen</option>
              {teachers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Datum
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (e.target.value) setWeek("");
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Woche
            <input
              type="week"
              value={week}
              onChange={(e) => {
                setWeek(e.target.value);
                if (e.target.value) setDate("");
              }}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => setUpcomingOnly((v) => !v)}
          className={`mt-3 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition cursor-pointer ${
            upcomingOnly
              ? "border-primary bg-primary-soft text-primary"
              : "border-border text-muted hover:bg-surface-hover"
          }`}
        >
          <CalendarClock size={14} />
          Nur kommende Prüfungen
        </button>
      </div>

      <p className="text-sm text-muted">
        {filtered.length} {filtered.length === 1 ? "Prüfung" : "Prüfungen"} gefunden
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="Keine Prüfungen gefunden"
          description="Passe die Filter an, um weitere Prüfungen zu sehen."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exam) => (
            <ExamCard key={exam.id} exam={exam} canManage={canManage} />
          ))}
        </div>
      )}
    </div>
  );
}
