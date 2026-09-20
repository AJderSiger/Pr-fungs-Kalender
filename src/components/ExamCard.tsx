import Link from "next/link";
import { CalendarDays, Clock, BookOpen, User, MapPin, Info, Pencil } from "lucide-react";
import type { ExamDTO } from "@/lib/types";
import { formatExamDate, formatExamTime, parseISODateLocal } from "@/lib/format";
import { DeleteExamButton } from "@/components/DeleteExamButton";

type ExamCardProps = {
  exam: ExamDTO;
  canManage?: boolean;
  compact?: boolean;
};

export function ExamCard({ exam, canManage = false, compact = false }: ExamCardProps) {
  const date = parseISODateLocal(exam.date);

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-primary-soft px-2 py-1 text-xs font-bold tracking-wide text-primary">
            {exam.subjectCode}
          </span>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">{exam.subject}</h3>
        </div>
        {exam.examType && (
          <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
            {exam.examType}
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays size={15} className="shrink-0 text-muted" />
          <span className="capitalize">{formatExamDate(date)}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={15} className="shrink-0 text-muted" />
          {formatExamTime(exam.lessonStart, exam.durationMinutes)} Uhr
        </p>
        <p className="flex items-center gap-2">
          <BookOpen size={15} className="shrink-0 text-muted" />
          {exam.title}
        </p>
        <p className="flex items-center gap-2">
          <User size={15} className="shrink-0 text-muted" />
          Lehrer: {exam.teacherName}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-muted" />
          Raum: {exam.room}
        </p>
        {!compact && exam.notes && (
          <p className="flex items-start gap-2 text-muted">
            <Info size={15} className="mt-0.5 shrink-0" />
            <span>{exam.notes}</span>
          </p>
        )}
      </div>

      {!compact && exam.description && (
        <p className="rounded-lg bg-background px-3 py-2 text-xs text-muted">{exam.description}</p>
      )}

      {canManage && (
        <div className="mt-1 flex items-center gap-2 border-t border-border pt-3">
          <Link
            href={`/lehrer/${exam.id}/bearbeiten`}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-hover"
          >
            <Pencil size={13} />
            Bearbeiten
          </Link>
          <DeleteExamButton examId={exam.id} examTitle={`${exam.subject} – ${exam.title}`} />
        </div>
      )}
    </div>
  );
}
