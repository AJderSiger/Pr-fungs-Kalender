import { redirect } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <CalendarCheck2 size={28} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prüfungsplaner</h1>
          <p className="mt-1 text-sm text-muted">Der gemeinsame Prüfungsplan unserer Klasse</p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Zugangsdaten von deiner Lehrperson erhältlich.
        </p>
      </div>
    </div>
  );
}
