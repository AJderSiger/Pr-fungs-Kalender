import { NextResponse } from "next/server";

/**
 * Diagnose-Endpunkt für die Inbetriebnahme: zeigt, ob die nötigen
 * Umgebungsvariablen zur Laufzeit ankommen und ob die Datenbank erreichbar
 * ist. Es werden bewusst keine Werte ausgegeben, nur Ja/Nein-Angaben.
 */
export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  const result: Record<string, unknown> = {
    hasDatabaseUrl: Boolean(databaseUrl),
    databaseUrlLength: databaseUrl?.length ?? 0,
    databaseHost: databaseUrl ? (safeHost(databaseUrl) ?? "unlesbar") : null,
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    nodeVersion: process.version,
  };

  try {
    const { prisma } = await import("@/lib/prisma");
    const userCount = await prisma.user.count();
    result.databaseReachable = true;
    result.userCount = userCount;
  } catch (error) {
    result.databaseReachable = false;
    result.databaseError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(result);
}

/** Gibt nur den Hostnamen zurück – niemals Benutzername oder Passwort. */
function safeHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
