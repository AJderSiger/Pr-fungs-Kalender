import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "";

  // Neon-Datenbanken (Produktion) laufen über den serverlosen HTTP/WebSocket-
  // Treiber statt über die native Query-Engine-Binärdatei. Das vermeidet
  // Probleme mit fehlenden Plattform-Binaries in Serverless-Umgebungen wie
  // Netlify Functions. Lokale Entwicklung (eigener Postgres-Server) nutzt
  // weiterhin den normalen Client.
  if (connectionString.includes("neon.tech")) {
    neonConfig.webSocketConstructor = ws;
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
