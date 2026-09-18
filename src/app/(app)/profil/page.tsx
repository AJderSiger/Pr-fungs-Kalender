import { UserCircle, ShieldCheck, GraduationCap } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function ProfilPage() {
  const session = await auth();
  const user = session!.user;
  const isTeacher = user.role === "TEACHER";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
        <UserCircle size={22} className="text-primary" />
        Profil
      </h1>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
          {isTeacher ? <ShieldCheck size={28} /> : <GraduationCap size={28} />}
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted">Benutzername: {user.username}</p>
        </div>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          {isTeacher ? "Lehrperson" : "Schüler"}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Berechtigungen</h2>
        <ul className="space-y-1.5 text-sm text-muted">
          {isTeacher ? (
            <>
              <li>✓ Prüfungen erstellen, bearbeiten und löschen</li>
              <li>✓ Prüfungen aller Lehrpersonen einsehen</li>
            </>
          ) : (
            <>
              <li>✓ Prüfungsplan und Kalender ansehen</li>
              <li>✓ Prüfungen filtern und Details öffnen</li>
            </>
          )}
        </ul>
      </div>

      <SignOutButton />
    </div>
  );
}
