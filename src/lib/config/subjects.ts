/**
 * Fächerliste der Klasse. Zentral konfigurierbar – bei Bedarf hier anpassen.
 */
export type Subject = {
  code: string;
  name: string;
};

export const SUBJECTS: Subject[] = [
  { code: "D", name: "Deutsch" },
  { code: "E", name: "Englisch" },
  { code: "F", name: "Französisch" },
  { code: "FRW", name: "Finanz- und Rechnungswesen" },
  { code: "G&P", name: "Geschichte und Politik" },
  { code: "M", name: "Mathematik" },
  { code: "S", name: "Sport" },
  { code: "TDA", name: "Technologien der digitalen Arbeitswelt" },
  { code: "W&R", name: "Wirtschaft und Recht" },
];

export function getSubjectByCode(code: string): Subject | undefined {
  return SUBJECTS.find((s) => s.code === code);
}

export const EXAM_TYPES = [
  "Schriftliche Prüfung",
  "Mündliche Prüfung",
  "Test",
  "Präsentation",
  "Praktische Prüfung",
] as const;
