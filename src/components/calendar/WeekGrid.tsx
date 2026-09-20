"use client";

import { clsx } from "clsx";
import type { ExamDTO } from "@/lib/types";
import { LESSONS, SCHOOL_DAY_INDICES, timeToMinutes } from "@/lib/config/lessons";
import { getWeekDates, toIsoDateString } from "@/lib/week";
import { ExamChip } from "@/components/calendar/ExamChip";

const WEEKDAY_LABELS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

const dayHeaderFormatter = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" });

const DAY_START_MINUTES = timeToMinutes(LESSONS[0].start);
const DAY_END_MINUTES = timeToMinutes(LESSONS[LESSONS.length - 1].end);
const TOTAL_MINUTES = DAY_END_MINUTES - DAY_START_MINUTES;
const PX_PER_MINUTE = 1.1;
const GRID_HEIGHT = TOTAL_MINUTES * PX_PER_MINUTE;
const MIN_CHIP_HEIGHT = 34;

function minutesToTop(minutes: number): number {
  return (minutes - DAY_START_MINUTES) * PX_PER_MINUTE;
}

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

  const examsByDay = weekDates.map((date) => {
    const iso = toIsoDateString(date);
    return exams.filter((exam) => exam.date === iso);
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface scrollbar-thin">
      <div className="grid min-w-[760px]" style={{ gridTemplateColumns: "56px repeat(5, minmax(130px, 1fr))" }}>
        <div className="sticky top-0 z-10 border-b border-r border-border bg-surface" />
        {weekDates.map((date, i) => {
          const isToday = toIsoDateString(date) === todayIso;
          const isSchoolDay = SCHOOL_DAY_INDICES.includes(i);
          return (
            <div
              key={i}
              className={clsx(
                "sticky top-0 z-10 border-b border-border px-2 py-2 text-center",
                i < 4 && "border-r",
                isSchoolDay ? "bg-surface" : "bg-background",
              )}
            >
              <p
                className={clsx(
                  "text-sm font-semibold",
                  isToday ? "text-primary" : isSchoolDay ? "text-foreground" : "text-muted",
                )}
              >
                {WEEKDAY_LABELS[i]}
              </p>
              <p className="text-xs text-muted">{dayHeaderFormatter.format(date)}</p>
            </div>
          );
        })}

        <div className="relative border-r border-border" style={{ height: GRID_HEIGHT }}>
          {LESSONS.map((lesson) => (
            <div
              key={lesson.number}
              className="absolute left-0 right-0 -translate-y-1/2 px-1.5 text-right text-[10px] leading-tight text-muted"
              style={{ top: minutesToTop(timeToMinutes(lesson.start)) }}
            >
              <span className="font-medium text-foreground">{lesson.number}</span> {lesson.start}
            </div>
          ))}
        </div>

        {weekDates.map((_, colIdx) => {
          const isSchoolDay = SCHOOL_DAY_INDICES.includes(colIdx);
          return (
            <div
              key={colIdx}
              className={clsx("relative", colIdx < 4 && "border-r border-border", !isSchoolDay && "bg-background")}
              style={{ height: GRID_HEIGHT }}
            >
              {LESSONS.map((lesson) => (
                <div
                  key={lesson.number}
                  className="absolute left-0 right-0 border-b border-border/50"
                  style={{ top: minutesToTop(timeToMinutes(lesson.end)) }}
                />
              ))}

              {examsByDay[colIdx].map((exam) => {
                const lesson = LESSONS.find((l) => l.number === exam.lessonStart);
                if (!lesson) return null;
                const top = minutesToTop(timeToMinutes(lesson.start));
                const height = Math.max(exam.durationMinutes * PX_PER_MINUTE, MIN_CHIP_HEIGHT);
                return (
                  <div key={exam.id} className="absolute left-1 right-1 z-[1]" style={{ top, height }}>
                    <ExamChip exam={exam} onSelect={onSelectExam} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
