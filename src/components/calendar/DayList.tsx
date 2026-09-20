"use client";

import type { ExamDTO } from "@/lib/types";
import { LESSONS, timeToMinutes, getExamEndTime } from "@/lib/config/lessons";
import { toIsoDateString } from "@/lib/week";
import { ExamChip } from "@/components/calendar/ExamChip";

export function DayList({
  date,
  exams,
  onSelectExam,
}: {
  date: Date;
  exams: ExamDTO[];
  onSelectExam: (exam: ExamDTO) => void;
}) {
  const iso = toIsoDateString(date);
  const dayExams = exams.filter((e) => e.date === iso);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
      {LESSONS.map((lesson) => {
        const lessonStartMin = timeToMinutes(lesson.start);
        const lessonEndMin = timeToMinutes(lesson.end);
        const lessonExams = dayExams.filter((exam) => {
          const examStartMin = timeToMinutes(LESSONS.find((l) => l.number === exam.lessonStart)?.start ?? "00:00");
          const examEndMin = timeToMinutes(getExamEndTime(exam.lessonStart, exam.durationMinutes));
          return examStartMin < lessonEndMin && examEndMin > lessonStartMin;
        });
        return (
          <div key={lesson.number} className="flex gap-4 px-4 py-3">
            <div className="w-16 shrink-0 text-xs text-muted">
              <div className="font-medium text-foreground">Lekt. {lesson.number}</div>
              <div>{lesson.start}</div>
              <div>{lesson.end}</div>
            </div>
            <div className="flex-1">
              {lessonExams.length === 0 ? (
                <div className="h-full min-h-[1.5rem]" />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {lessonExams.map((exam) => (
                    <ExamChip key={exam.id} exam={exam} onSelect={onSelectExam} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
