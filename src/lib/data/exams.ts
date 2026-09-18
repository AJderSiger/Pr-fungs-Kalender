import "server-only";
import { prisma } from "@/lib/prisma";

export type ExamWithTeacher = Awaited<ReturnType<typeof getAllExams>>[number];

export async function getAllExams() {
  return prisma.exam.findMany({
    include: {
      teacher: { select: { id: true, displayName: true, username: true } },
    },
    orderBy: [{ date: "asc" }, { lessonStart: "asc" }],
  });
}

export async function getUpcomingExams(limit = 5) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return prisma.exam.findMany({
    where: { date: { gte: today } },
    include: {
      teacher: { select: { id: true, displayName: true, username: true } },
    },
    orderBy: [{ date: "asc" }, { lessonStart: "asc" }],
    take: limit,
  });
}

export async function getExamById(id: string) {
  return prisma.exam.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, displayName: true, username: true } },
    },
  });
}

export async function getAllTeachers() {
  return prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, displayName: true, username: true },
    orderBy: { displayName: "asc" },
  });
}
