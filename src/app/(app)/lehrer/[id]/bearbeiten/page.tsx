import { notFound, redirect } from "next/navigation";
import { Pencil } from "lucide-react";
import { auth } from "@/lib/auth";
import { getExamById } from "@/lib/data/exams";
import { toExamDTO } from "@/lib/types";
import { updateExam } from "@/lib/actions/exams";
import { ExamForm } from "@/components/ExamForm";

export default async function BearbeitenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user.role !== "TEACHER") redirect("/dashboard");

  const exam = await getExamById(id);
  if (!exam) notFound();

  const boundAction = updateExam.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <Pencil size={22} className="text-primary" />
        Prüfung bearbeiten
      </h1>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <ExamForm action={boundAction} initialValues={toExamDTO(exam)} submitLabel="Änderungen speichern" />
      </div>
    </div>
  );
}
