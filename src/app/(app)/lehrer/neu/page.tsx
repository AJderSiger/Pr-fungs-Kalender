import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { createExam } from "@/lib/actions/exams";
import { ExamForm } from "@/components/ExamForm";

export default async function NeueExamPage() {
  const session = await auth();
  if (session?.user.role !== "TEACHER") redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <Plus size={22} className="text-primary" />
        Neue Prüfung erstellen
      </h1>
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <ExamForm action={createExam} submitLabel="Prüfung erstellen" />
      </div>
    </div>
  );
}
