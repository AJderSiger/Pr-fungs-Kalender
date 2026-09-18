import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

/**
 * Zugangsdaten werden zentral in der Datenbank gespeichert (gehasht),
 * nicht im Frontend. Über Umgebungsvariablen lassen sich Benutzername und
 * Passwort beim Seeden überschreiben, ohne Code anzupassen.
 */
const STUDENT_USERNAME = process.env.SEED_STUDENT_USERNAME ?? "Schüler";
const STUDENT_PASSWORD = process.env.SEED_STUDENT_PASSWORD ?? "123456";
const TEACHER_USERNAME = process.env.SEED_TEACHER_USERNAME ?? "Lehrer";
const TEACHER_PASSWORD = process.env.SEED_TEACHER_PASSWORD ?? "123456";

async function upsertUser(username: string, password: string, role: "STUDENT" | "TEACHER", displayName: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role, displayName },
    create: { username, passwordHash, role, displayName },
  });
  console.log(`✓ Benutzer "${username}" (${role}) angelegt/aktualisiert.`);
}

async function main() {
  await upsertUser(STUDENT_USERNAME, STUDENT_PASSWORD, "STUDENT", "Schüler");
  await upsertUser(TEACHER_USERNAME, TEACHER_PASSWORD, "TEACHER", "Lehrer");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
