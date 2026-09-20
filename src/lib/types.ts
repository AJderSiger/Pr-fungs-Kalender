export type ExamDTO = {
  id: string;
  subject: string;
  subjectCode: string;
  date: string; // ISO date (yyyy-MM-dd)
  lessonStart: number;
  durationMinutes: number;
  title: string;
  description: string | null;
  examType: string | null;
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
  durationMinutes: number;
  title: string;
  description: string | null;
  examType: string | null;
  notes: string | null;
  teacherId: string;
  teacherName: string;
};

export function toExamDTO(exam: PrismaExamWithTeacher): ExamDTO {
  return {
    id: exam.id,
    subject: exam.subject,
    subjectCode: exam.subjectCode,
    date: exam.date.toISOString().slice(0, 10),
    lessonStart: exam.lessonStart,
    durationMinutes: exam.durationMinutes,
    title: exam.title,
    description: exam.description,
    examType: exam.examType,
    notes: exam.notes,
    teacherId: exam.teacherId,
    teacherName: exam.teacherName,
  };
}
