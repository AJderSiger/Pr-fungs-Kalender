import "server-only";
import { prisma } from "@/lib/prisma";
import { DEFAULT_TEACHER_BY_SUBJECT } from "@/lib/config/teachers";

export type ExamWithTeacher = Awaited<ReturnType<typeof getAllExams>>[number];

export async function getAllExams() {
  return prisma.exam.findMany({
    orderBy: [{ date: "asc" }, { lessonStart: "asc" }],
  });
}

export async function getUpcomingExams(limit = 5) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return prisma.exam.findMany({
    where: { date: { gte: today } },
    orderBy: [{ date: "asc" }, { lessonStart: "asc" }],
    take: limit,
  });
}

export async function getExamById(id: string) {
  return prisma.exam.findUnique({ where: { id } });
}

/** Alle bekannten Fachlehrpersonen, für das Filter-Dropdown "Lehrer". */
export function getAllTeacherNames(): string[] {
  return Array.from(new Set(Object.values(DEFAULT_TEACHER_BY_SUBJECT))).sort((a, b) =>
    a.localeCompare(b, "de-CH"),
  );
}
