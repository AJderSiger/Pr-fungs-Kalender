"use client";

import type { ExamDTO } from "@/lib/types";

export function ExamChip({ exam, onSelect }: { exam: ExamDTO; onSelect: (exam: ExamDTO) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exam)}
      className="w-full rounded-lg border border-primary/30 bg-primary-soft px-2 py-1.5 text-left text-primary transition hover:brightness-95 cursor-pointer"
    >
      <span className="block text-[11px] font-bold uppercase tracking-wide">{exam.subjectCode}</span>
      <span className="block truncate text-[11px] leading-tight opacity-90">{exam.title}</span>
    </button>
  );
}
