"use client";

import type { ExamDTO } from "@/lib/types";
import { LESSONS } from "@/lib/config/lessons";
import { getWeekDates, toIsoDateString } from "@/lib/week";
import { ExamChip } from "@/components/calendar/ExamChip";

const WEEKDAY_LABELS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

const dayHeaderFormatter = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" });

export function WeekGrid({
  monday,
  exams,
  onSelectExam,
}: {
  monday: Date;
  exams: ExamDTO[];
  onSelectExam: (exam: ExamDTO) => void;
}) {
  const weekDates = getWeekDates(monday);
  const todayIso = toIsoDateString(new Date());

  const examsByKey = new Map<string, ExamDTO[]>();
  for (const exam of exams) {
    const dayIndex = weekDates.findIndex((d) => toIsoDateString(d) === exam.date);
    if (dayIndex === -1) continue;
    const key = `${dayIndex}-${exam.lessonStart}-${exam.lessonEnd}`;
    const list = examsByKey.get(key) ?? [];
    list.push(exam);
    examsByKey.set(key, list);
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface scrollbar-thin">
      <div
        className="grid min-w-[760px]"
        style={{
          gridTemplateColumns: "72px repeat(5, minmax(130px, 1fr))",
          gridTemplateRows: `auto repeat(${LESSONS.length}, minmax(56px, auto))`,
        }}
      >
        <div className="sticky top-0 z-10 border-b border-r border-border bg-surface" />
        {weekDates.map((date, i) => {
          const isToday = toIsoDateString(date) === todayIso;
          return (
            <div
              key={i}
              className={`sticky top-0 z-10 border-b border-border bg-surface px-2 py-2 text-center ${
                i < 4 ? "border-r" : ""
              }`}
            >
              <p className={`text-sm font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                {WEEKDAY_LABELS[i]}
              </p>
              <p className="text-xs text-muted">{dayHeaderFormatter.format(date)}</p>
            </div>
          );
        })}

        {LESSONS.map((lesson, rowIdx) => (
          <div
            key={`time-${lesson.number}`}
            className="border-r border-border px-2 py-1.5 text-right text-[11px] leading-tight text-muted"
            style={{ gridColumn: 1, gridRow: rowIdx + 2 }}
          >
            <div className="font-medium text-foreground">{lesson.number}</div>
            <div>{lesson.start}</div>
            <div>{lesson.end}</div>
          </div>
        ))}

        {LESSONS.map((lesson, rowIdx) =>
          weekDates.map((_, colIdx) => (
            <div
              key={`cell-${rowIdx}-${colIdx}`}
              className={`border-b border-border ${colIdx < 4 ? "border-r" : ""}`}
              style={{ gridColumn: colIdx + 2, gridRow: rowIdx + 2 }}
            />
          )),
        )}

        {Array.from(examsByKey.entries()).map(([key, examList]) => {
          const [dayIndexStr, startStr, endStr] = key.split("-");
          const dayIndex = Number(dayIndexStr);
          const lessonStart = Number(startStr);
          const lessonEnd = Number(endStr);
          return (
            <div
              key={key}
              className="flex flex-col gap-1 overflow-hidden p-1"
              style={{
                gridColumn: dayIndex + 2,
                gridRow: `${lessonStart + 1} / ${lessonEnd + 2}`,
              }}
            >
              {examList.map((exam) => (
                <ExamChip key={exam.id} exam={exam} onSelect={onSelectExam} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
