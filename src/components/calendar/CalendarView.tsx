"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { clsx } from "clsx";
import type { ExamDTO } from "@/lib/types";
import { addDays, startOfWeekMonday } from "@/lib/week";
import { WeekGrid } from "@/components/calendar/WeekGrid";
import { DayList } from "@/components/calendar/DayList";
import { MonthGrid } from "@/components/calendar/MonthGrid";
import { Modal } from "@/components/Modal";
import { ExamCard } from "@/components/ExamCard";

type ViewMode = "day" | "week" | "month";

const monthYearFormatter = new Intl.DateTimeFormat("de-CH", { month: "long", year: "numeric" });
const dayFormatter = new Intl.DateTimeFormat("de-CH", { weekday: "long", day: "2-digit", month: "long" });
const weekRangeFormatter = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" });

export function CalendarView({ exams, canManage }: { exams: ExamDTO[]; canManage: boolean }) {
  const [view, setView] = useState<ViewMode>("week");
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [selectedExam, setSelectedExam] = useState<ExamDTO | null>(null);

  const monday = useMemo(() => startOfWeekMonday(referenceDate), [referenceDate]);

  function navigate(direction: -1 | 1) {
    setReferenceDate((current) => {
      if (view === "day") return addDays(current, direction);
      if (view === "week") return addDays(current, direction * 7);
      return new Date(current.getFullYear(), current.getMonth() + direction, 1);
    });
  }

  function goToToday() {
    setReferenceDate(new Date());
  }

  const rangeLabel =
    view === "day"
      ? dayFormatter.format(referenceDate)
      : view === "week"
        ? `${weekRangeFormatter.format(monday)} – ${weekRangeFormatter.format(addDays(monday, 4))}`
        : monthYearFormatter.format(referenceDate);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition cursor-pointer",
                view === mode ? "bg-primary text-primary-foreground" : "text-muted hover:bg-surface-hover",
              )}
            >
              {mode === "day" ? "Tag" : mode === "week" ? "Woche" : "Monat"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Zurück"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-surface-hover cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-hover cursor-pointer"
            >
              Heute
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              aria-label="Weiter"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground transition hover:bg-surface-hover cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-sm font-medium capitalize text-foreground">
            <CalendarDays size={15} className="text-primary" />
            {rangeLabel}
          </p>
        </div>
      </div>

      {view === "week" && <WeekGrid monday={monday} exams={exams} onSelectExam={setSelectedExam} />}
      {view === "day" && <DayList date={referenceDate} exams={exams} onSelectExam={setSelectedExam} />}
      {view === "month" && (
        <MonthGrid
          monthDate={referenceDate}
          exams={exams}
          onSelectExam={setSelectedExam}
          onSelectDay={(day) => {
            setReferenceDate(day);
            setView("day");
          }}
        />
      )}

      <Modal open={!!selectedExam} onClose={() => setSelectedExam(null)} title="Prüfungsdetails">
        {selectedExam && <ExamCard exam={selectedExam} canManage={canManage} />}
      </Modal>
    </div>
  );
}
