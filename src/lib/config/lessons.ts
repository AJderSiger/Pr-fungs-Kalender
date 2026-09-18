/**
 * Lektionenplan der Schule.
 *
 * Diese Zeiten stammen exakt aus der Vorgabe (inkl. der sich überschneidenden
 * Zeiten bei Lektion 8/9 – das wurde bewusst nicht verändert). Passe die
 * Zeiten hier zentral an, alle Teile der App (Kalender, Dropdown bei der
 * Prüfungserstellung, Stundenplan-Ansicht) verwenden diese Konfiguration.
 */
export type Lesson = {
  number: number;
  start: string; // Format "HH:mm"
  end: string; // Format "HH:mm"
};

export const LESSONS: Lesson[] = [
  { number: 1, start: "07:40", end: "08:25" },
  { number: 2, start: "08:30", end: "09:15" },
  { number: 3, start: "09:35", end: "10:20" },
  { number: 4, start: "10:25", end: "11:10" },
  { number: 5, start: "11:15", end: "12:00" },
  { number: 6, start: "12:05", end: "12:50" },
  { number: 7, start: "13:00", end: "13:45" },
  { number: 8, start: "13:50", end: "14:45" },
  { number: 9, start: "14:40", end: "15:25" },
  { number: 10, start: "15:40", end: "16:25" },
  { number: 11, start: "16:30", end: "17:15" },
  { number: 12, start: "17:30", end: "18:15" },
  { number: 13, start: "18:20", end: "19:05" },
];

export function getLesson(number: number): Lesson | undefined {
  return LESSONS.find((l) => l.number === number);
}

export function formatLessonRange(startNumber: number, endNumber: number): string {
  const start = getLesson(startNumber);
  const end = getLesson(endNumber);
  if (!start || !end) return "";
  if (startNumber === endNumber) return `${start.start} – ${start.end}`;
  return `${start.start} – ${end.end}`;
}
