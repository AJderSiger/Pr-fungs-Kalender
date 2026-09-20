/**
 * Stundenplan der Klasse (Wochentag × Lektion → Fach), gemäss dem
 * eingereichten Stundenplan. Wochentag: 0 = Montag … 4 = Freitag.
 * Wird verwendet, um beim Erstellen einer Prüfung automatisch die
 * passende(n) Lektion(en) für das gewählte Fach vorzuschlagen.
 * Bei Stundenplanänderungen hier anpassen.
 */
export type TimetableEntry = {
  weekday: number;
  lesson: number;
  subjectCode: string;
};

const DONNERSTAG = 3;
const FREITAG = 4;

export const TIMETABLE: TimetableEntry[] = [
  // Donnerstag
  { weekday: DONNERSTAG, lesson: 1, subjectCode: "FRW" },
  { weekday: DONNERSTAG, lesson: 2, subjectCode: "FRW" },
  { weekday: DONNERSTAG, lesson: 3, subjectCode: "W&R" },
  { weekday: DONNERSTAG, lesson: 4, subjectCode: "W&R" },
  { weekday: DONNERSTAG, lesson: 5, subjectCode: "S" },
  { weekday: DONNERSTAG, lesson: 6, subjectCode: "W&R" },
  { weekday: DONNERSTAG, lesson: 8, subjectCode: "M" },
  { weekday: DONNERSTAG, lesson: 9, subjectCode: "M" },
  { weekday: DONNERSTAG, lesson: 10, subjectCode: "TDA" },
  { weekday: DONNERSTAG, lesson: 11, subjectCode: "TDA" },
  // Freitag
  { weekday: FREITAG, lesson: 2, subjectCode: "D" },
  { weekday: FREITAG, lesson: 3, subjectCode: "D" },
  { weekday: FREITAG, lesson: 4, subjectCode: "FRW" },
  { weekday: FREITAG, lesson: 5, subjectCode: "G&P" },
  { weekday: FREITAG, lesson: 6, subjectCode: "G&P" },
  { weekday: FREITAG, lesson: 8, subjectCode: "E" },
  { weekday: FREITAG, lesson: 9, subjectCode: "E" },
  { weekday: FREITAG, lesson: 10, subjectCode: "F" },
  { weekday: FREITAG, lesson: 11, subjectCode: "F" },
];

/** Lektionen (aufsteigend), in denen das Fach an diesem Wochentag stattfindet. */
export function getLessonsForSubjectOnWeekday(subjectCode: string, weekday: number): number[] {
  return TIMETABLE.filter((e) => e.subjectCode === subjectCode && e.weekday === weekday)
    .map((e) => e.lesson)
    .sort((a, b) => a - b);
}

/** Früheste Lektion des Fachs über den ganzen Stundenplan (Fallback ohne Datum). */
export function getEarliestLessonForSubject(subjectCode: string): number | null {
  const lessons = TIMETABLE.filter((e) => e.subjectCode === subjectCode).map((e) => e.lesson);
  return lessons.length > 0 ? Math.min(...lessons) : null;
}

/**
 * Vorgeschlagene Start-Lektion für ein Fach an einem bestimmten Wochentag:
 * die früheste Lektion an genau diesem Tag, sonst die früheste im ganzen
 * Stundenplan, sonst null.
 */
export function suggestLessonStart(subjectCode: string, weekday: number | null): number | null {
  if (weekday !== null) {
    const onDay = getLessonsForSubjectOnWeekday(subjectCode, weekday);
    if (onDay.length > 0) return onDay[0];
  }
  return getEarliestLessonForSubject(subjectCode);
}
