"use client";

import type { ExamDTO } from "@/lib/types";
import { addDays, startOfWeekMonday, toIsoDateString } from "@/lib/week";

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function MonthGrid({
  monthDate,
  exams,
  onSelectExam,
  onSelectDay,
}: {
  monthDate: Date;
  exams: ExamDTO[];
  onSelectExam: (exam: ExamDTO) => void;
  onSelectDay: (date: Date) => void;
}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = startOfWeekMonday(firstOfMonth);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const todayIso = toIsoDateString(new Date());

  const examsByDate = new Map<string, ExamDTO[]>();
  for (const exam of exams) {
    const list = examsByDate.get(exam.date) ?? [];
    list.push(exam);
    examsByDate.set(exam.date, list);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="grid grid-cols-7 border-b border-border bg-background">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-2 text-center text-xs font-semibold text-muted">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const iso = toIsoDateString(day);
          const inMonth = day.getMonth() === month;
          const isToday = iso === todayIso;
          const dayExams = examsByDate.get(iso) ?? [];

          return (
            <button
              type="button"
              key={i}
              onClick={() => onSelectDay(day)}
              className={`flex min-h-[92px] flex-col items-start gap-1 border-b border-r border-border p-1.5 text-left transition hover:bg-surface-hover cursor-pointer ${
                inMonth ? "" : "opacity-40"
              } ${(i + 1) % 7 === 0 ? "border-r-0" : ""}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isToday ? "bg-primary text-primary-foreground font-semibold" : "text-muted"
                }`}
              >
                {day.getDate()}
              </span>
              <div className="flex w-full flex-col gap-0.5">
                {dayExams.slice(0, 2).map((exam) => (
                  <span
                    key={exam.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExam(exam);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        onSelectExam(exam);
                      }
                    }}
                    className="truncate rounded bg-primary-soft px-1 py-0.5 text-[10px] font-medium text-primary"
                  >
                    {exam.subjectCode}
                  </span>
                ))}
                {dayExams.length > 2 && (
                  <span className="text-[10px] text-muted">+{dayExams.length - 2} mehr</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
