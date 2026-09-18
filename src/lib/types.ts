export type ExamDTO = {
  id: string;
  subject: string;
  subjectCode: string;
  date: string; // ISO date (yyyy-MM-dd)
  lessonStart: number;
  lessonEnd: number;
  title: string;
  description: string | null;
  examType: string | null;
  room: string | null;
  notes: string | null;
  teacherId: string;
  teacherName: string;
};

type PrismaExamWithTeacher = {
  id: string;
  subject: string;
  subjectCode: string;
  date: Date;
  lessonStart: number;
  lessonEnd: number;
  title: string;
  description: string | null;
  examType: string | null;
  room: string | null;
  notes: string | null;
  teacherId: string;
  teacher: { displayName: string };
};

export function toExamDTO(exam: PrismaExamWithTeacher): ExamDTO {
  return {
    id: exam.id,
    subject: exam.subject,
    subjectCode: exam.subjectCode,
    date: exam.date.toISOString().slice(0, 10),
    lessonStart: exam.lessonStart,
    lessonEnd: exam.lessonEnd,
    title: exam.title,
    description: exam.description,
    examType: exam.examType,
    room: exam.room,
    notes: exam.notes,
    teacherId: exam.teacherId,
    teacherName: exam.teacher.displayName,
  };
}
