/**
 * Standard-Lehrperson pro Fach, gemäss Stundenplan der Klasse. Wird beim
 * Erstellen einer Prüfung automatisch vorgeschlagen (im Formular
 * überschreibbar). Bei Bedarf hier anpassen, z. B. bei Lehrpersonenwechsel.
 */
export const DEFAULT_TEACHER_BY_SUBJECT: Record<string, string> = {
  D: "Jevaire Crameri",
  E: "Corinne Blaser-Koll",
  F: "Jevaire Crameri",
  FRW: "Juliette Merath",
  "G&P": "Marc Roobol",
  M: "Susanne Stolle",
  S: "Christian Mauch",
  TDA: "Roger Marti",
  "W&R": "Juliette Merath",
};

/**
 * Fächer, deren Prüfungen standardmässig auf die 1. Lektion gelegt werden
 * (gleiche Lehrperson, meist am frühen Morgen unterrichtet).
 */
export const MORNING_PRIORITY_SUBJECTS = ["FRW", "W&R"];

export function getDefaultTeacherForSubject(subjectCode: string): string {
  return DEFAULT_TEACHER_BY_SUBJECT[subjectCode] ?? "";
}

/** Standard-Raum, da die Klasse die meisten Prüfungen im selben Zimmer schreibt. */
export const DEFAULT_ROOM = "403";
