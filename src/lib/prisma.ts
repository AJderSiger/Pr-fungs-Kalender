import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  // Fehlt die Variable, soll das sofort und deutlich scheitern. Sonst würde
  // Prisma erst tief im Request-Handling abbrechen und der Fehler käme im
  // Frontend als irreführendes "Anmeldung fehlgeschlagen" an.
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL ist nicht gesetzt. In der Hosting-Umgebung muss die Variable auch zur Laufzeit (Functions/Runtime) verfügbar sein.",
    );
  }

  // Der node-postgres-Adapter spricht jeden PostgreSQL-Server (lokal wie Neon)
  // über eine normale Verbindung an, statt über die plattformabhängige
  // Query-Engine-Binärdatei. Dadurch gibt es genau einen Codepfad – lokal
  // getestetes Verhalten entspricht dem in der Produktion.
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
