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
  teacherName: string;
  room: string;
  notes: string | null;
  teacherId: string;
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
  teacherName: string;
  room: string;
  notes: string | null;
  teacherId: string;
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
    teacherName: exam.teacherName,
    room: exam.room,
    notes: exam.notes,
    teacherId: exam.teacherId,
  };
}
