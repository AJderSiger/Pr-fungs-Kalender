"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { examFormSchema } from "@/lib/validation/exam";
import { getSubjectByCode } from "@/lib/config/subjects";

export type ActionResult =
  | { success: true; id: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

function revalidateExamPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/pruefungen");
  revalidatePath("/kalender");
}

async function requireTeacher() {
  const session = await auth();
  if (!session?.user || session.user.role !== "TEACHER") {
    return null;
  }
  return session.user;
}

function parseFormData(formData: FormData) {
  const raw = {
    subjectCode: String(formData.get("subjectCode") ?? ""),
    date: String(formData.get("date") ?? ""),
    lessonStart: String(formData.get("lessonStart") ?? ""),
    lessonEnd: String(formData.get("lessonEnd") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    examType: String(formData.get("examType") ?? ""),
    room: String(formData.get("room") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = examFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false as const, fieldErrors };
  }

  return { success: true as const, data: parsed.data };
}

export async function createExam(_prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const teacher = await requireTeacher();
  if (!teacher) {
    return { success: false, error: "Nur Lehrpersonen dürfen Prüfungen erstellen." };
  }

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: "Bitte Eingaben prüfen.", fieldErrors: parsed.fieldErrors };
  }

  const subject = getSubjectByCode(parsed.data.subjectCode);
  if (!subject) {
    return { success: false, error: "Ungültiges Fach." };
  }

  const exam = await prisma.exam.create({
    data: {
      subject: subject.name,
      subjectCode: subject.code,
      date: new Date(`${parsed.data.date}T00:00:00.000Z`),
      lessonStart: parsed.data.lessonStart,
      lessonEnd: parsed.data.lessonEnd,
      title: parsed.data.title,
      description: parsed.data.description || null,
      examType: parsed.data.examType || null,
      room: parsed.data.room || null,
      notes: parsed.data.notes || null,
      teacherId: teacher.id,
    },
  });

  revalidateExamPaths();
  return { success: true, id: exam.id };
}

export async function updateExam(
  examId: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const teacher = await requireTeacher();
  if (!teacher) {
    return { success: false, error: "Nur Lehrpersonen dürfen Prüfungen bearbeiten." };
  }

  const existing = await prisma.exam.findUnique({ where: { id: examId } });
  if (!existing) {
    return { success: false, error: "Prüfung wurde nicht gefunden." };
  }

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { success: false, error: "Bitte Eingaben prüfen.", fieldErrors: parsed.fieldErrors };
  }

  const subject = getSubjectByCode(parsed.data.subjectCode);
  if (!subject) {
    return { success: false, error: "Ungültiges Fach." };
  }

  await prisma.exam.update({
    where: { id: examId },
    data: {
      subject: subject.name,
      subjectCode: subject.code,
      date: new Date(`${parsed.data.date}T00:00:00.000Z`),
      lessonStart: parsed.data.lessonStart,
      lessonEnd: parsed.data.lessonEnd,
      title: parsed.data.title,
      description: parsed.data.description || null,
      examType: parsed.data.examType || null,
      room: parsed.data.room || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidateExamPaths();
  return { success: true, id: examId };
}

export async function deleteExam(examId: string): Promise<ActionResult> {
  const teacher = await requireTeacher();
  if (!teacher) {
    return { success: false, error: "Nur Lehrpersonen dürfen Prüfungen löschen." };
  }

  const existing = await prisma.exam.findUnique({ where: { id: examId } });
  if (!existing) {
    return { success: false, error: "Prüfung wurde nicht gefunden." };
  }

  await prisma.exam.delete({ where: { id: examId } });

  revalidateExamPaths();
  return { success: true, id: examId };
}
