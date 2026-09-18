import Link from "next/link";
import { CalendarClock, Plus, ListChecks } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAllExams } from "@/lib/data/exams";
import { toExamDTO } from "@/lib/types";
import { ExamCard } from "@/components/ExamCard";
import { EmptyState } from "@/components/EmptyState";

export default async function DashboardPage() {
  const session = await auth();
  const role = session!.user.role;
  const isTeacher = role === "TEACHER";

  const allExams = (await getAllExams()).map(toExamDTO);

  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = allExams.filter((e) => e.date >= todayIso).slice(0, 5);
  const rest = allExams;

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <CalendarClock size={22} className="text-primary" />
            Nächste Prüfungen
          </h1>
          {isTeacher && (
            <Link
              href="/lehrer/neu"
              className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover sm:flex"
            >
              <Plus size={16} />
              Prüfung erstellen
            </Link>
          )}
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            title="Keine anstehenden Prüfungen"
            description={
              isTeacher
                ? "Erstelle eine neue Prüfung, damit sie hier erscheint."
                : "Aktuell sind keine Prüfungen geplant. Schau später wieder vorbei."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((exam) => (
              <ExamCard key={exam.id} exam={exam} canManage={isTeacher} compact />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <ListChecks size={20} className="text-primary" />
          Gesamter Prüfungsplan
        </h2>

        {rest.length === 0 ? (
          <EmptyState
            title="Noch keine Prüfungen erfasst"
            description="Sobald Prüfungen erstellt wurden, erscheinen sie hier."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((exam) => (
              <ExamCard key={exam.id} exam={exam} canManage={isTeacher} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
