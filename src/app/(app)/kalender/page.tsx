import { CalendarDays } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAllExams } from "@/lib/data/exams";
import { toExamDTO } from "@/lib/types";
import { CalendarView } from "@/components/calendar/CalendarView";

export default async function KalenderPage() {
  const session = await auth();
  const isTeacher = session!.user.role === "TEACHER";
  const exams = (await getAllExams()).map(toExamDTO);

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <CalendarDays size={22} className="text-primary" />
        Kalender
      </h1>
      <CalendarView exams={exams} canManage={isTeacher} />
    </div>
  );
}
