import { formatExamTimeRange } from "@/lib/config/lessons";

/** Parst ein "yyyy-MM-dd"-Datum als lokales Datum (ohne Zeitzonen-Verschiebung). */
export function parseISODateLocal(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

const dateFormatter = new Intl.DateTimeFormat("de-CH", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

const shortDateFormatter = new Intl.DateTimeFormat("de-CH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatExamDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatExamDateShort(date: Date): string {
  return shortDateFormatter.format(date);
}

export function formatExamTime(lessonStart: number, durationMinutes: number): string {
  return formatExamTimeRange(lessonStart, durationMinutes);
}
