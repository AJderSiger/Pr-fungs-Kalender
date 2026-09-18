import { ListChecks } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAllExams, getAllTeachers } from "@/lib/data/exams";
import { toExamDTO } from "@/lib/types";
import { ExamExplorer } from "@/components/ExamExplorer";

export default async function PruefungenPage() {
  const session = await auth();
  const isTeacher = session!.user.role === "TEACHER";

  const [exams, teachers] = await Promise.all([getAllExams(), getAllTeachers()]);

  return (
    <div className="space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <ListChecks size={22} className="text-primary" />
        Prüfungen
      </h1>
      <ExamExplorer exams={exams.map(toExamDTO)} teachers={teachers} canManage={isTeacher} />
    </div>
  );
}
