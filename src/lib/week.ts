import { parseISODateLocal } from "@/lib/format";

/** Gibt die ISO-Wochennummer (z.B. "2026-W38") für ein "yyyy-MM-dd"-Datum zurück. */
export function getIsoWeek(isoDate: string): string {
  const date = parseISODateLocal(isoDate);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = (target.getDay() + 6) % 7; // Montag = 0
  target.setDate(target.getDate() - dayNumber + 3); // Donnerstag der aktuellen Woche
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDayNumber = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3);
  const weekNumber = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

export function isDateInIsoWeek(isoDate: string, isoWeek: string): boolean {
  return getIsoWeek(isoDate) === isoWeek;
}

export function startOfWeekMonday(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = (result.getDay() + 6) % 7; // Montag = 0
  result.setDate(result.getDate() - dayNumber);
  return result;
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function toIsoDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => addDays(monday, i));
}

/** Montag der angegebenen ISO-Woche als Date-Objekt. */
export function getMondayOfIsoWeek(isoWeek: string): Date {
  const [yearStr, weekStr] = isoWeek.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const jan4 = new Date(year, 0, 4);
  const jan4Day = (jan4.getDay() + 6) % 7;
  const mondayWeek1 = new Date(year, 0, 4 - jan4Day);
  const monday = new Date(mondayWeek1);
  monday.setDate(mondayWeek1.getDate() + (week - 1) * 7);
  return monday;
}
