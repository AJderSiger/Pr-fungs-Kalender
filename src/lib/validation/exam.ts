import { z } from "zod";
import { SUBJECTS } from "@/lib/config/subjects";
import { LESSONS } from "@/lib/config/lessons";

const validSubjectCodes = SUBJECTS.map((s) => s.code) as [string, ...string[]];
const validLessonNumbers = LESSONS.map((l) => l.number);

export const examFormSchema = z
  .object({
    subjectCode: z.enum(validSubjectCodes, { message: "Bitte ein Fach auswählen." }),
    date: z
      .string()
      .min(1, "Bitte ein Datum auswählen.")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Ungültiges Datum."),
    lessonStart: z.coerce
      .number()
      .refine((v) => validLessonNumbers.includes(v), "Ungültige Lektion."),
    lessonEnd: z.coerce
      .number()
      .refine((v) => validLessonNumbers.includes(v), "Ungültige Lektion."),
    title: z
      .string()
      .trim()
      .min(2, "Titel muss mindestens 2 Zeichen lang sein.")
      .max(120, "Titel darf maximal 120 Zeichen lang sein."),
    description: z.string().trim().max(2000, "Beschreibung ist zu lang.").optional().or(z.literal("")),
    examType: z.string().trim().max(60).optional().or(z.literal("")),
    room: z.string().trim().max(40).optional().or(z.literal("")),
    notes: z.string().trim().max(1000, "Hinweise sind zu lang.").optional().or(z.literal("")),
  })
  .refine((data) => data.lessonEnd >= data.lessonStart, {
    message: "Die End-Lektion darf nicht vor der Start-Lektion liegen.",
    path: ["lessonEnd"],
  });

export type ExamFormValues = z.infer<typeof examFormSchema>;
