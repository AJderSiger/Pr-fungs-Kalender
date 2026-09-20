import { z } from "zod";
import { SUBJECTS } from "@/lib/config/subjects";
import { LESSONS, DURATION_OPTIONS_MINUTES } from "@/lib/config/lessons";

const validSubjectCodes = SUBJECTS.map((s) => s.code) as [string, ...string[]];
const validLessonNumbers = LESSONS.map((l) => l.number);
const validDurations = DURATION_OPTIONS_MINUTES as readonly number[];

export const examFormSchema = z.object({
  subjectCode: z.enum(validSubjectCodes, { message: "Bitte ein Fach auswählen." }),
  date: z
    .string()
    .min(1, "Bitte ein Datum auswählen.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Ungültiges Datum."),
  lessonStart: z.coerce
    .number()
    .refine((v) => validLessonNumbers.includes(v), "Ungültige Lektion."),
  durationMinutes: z.coerce
    .number()
    .refine((v) => validDurations.includes(v), "Ungültige Prüfungsdauer."),
  title: z
    .string()
    .trim()
    .min(2, "Titel muss mindestens 2 Zeichen lang sein.")
    .max(120, "Titel darf maximal 120 Zeichen lang sein."),
  description: z.string().trim().max(2000, "Beschreibung ist zu lang.").optional().or(z.literal("")),
  examType: z.string().trim().max(60).optional().or(z.literal("")),
  teacherName: z
    .string()
    .trim()
    .min(2, "Name der Lehrperson muss mindestens 2 Zeichen lang sein.")
    .max(80, "Name der Lehrperson ist zu lang."),
  notes: z.string().trim().max(1000, "Hinweise sind zu lang.").optional().or(z.literal("")),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;
