# Prüfungsplaner

Gemeinsamer Prüfungsplan für die Klasse: Lehrpersonen tragen Prüfungen ein, Schülerinnen und Schüler sehen alle anstehenden Prüfungen in einer Kalender-/Stundenplan-Ansicht. Alle Daten liegen zentral in einer PostgreSQL-Datenbank – jede Änderung ist sofort für alle Nutzer:innen sichtbar.

## Tech-Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) – Frontend & Backend in einer Anwendung
- **PostgreSQL** + **Prisma ORM** – zentrale, persistente Datenhaltung
- **Auth.js (NextAuth v5)** – Login mit Credentials-Provider, Passwörter gehasht mit bcrypt, Sessions als JWT
- **Tailwind CSS v4** – Styling, inkl. Dark Mode
- Gehostet für z. B. **Vercel** (Frontend) + **Neon/Supabase** (Postgres)

## Rollen & Zugangsdaten

Zwei Rollen sind vorkonfiguriert (zentral in der Datenbank gespeichert, nicht im Frontend):

| Rolle    | Benutzername | Passwort |
| -------- | ------------ | -------- |
| Schüler  | `Schüler`    | `123456` |
| Lehrer   | `Lehrer`     | `123456` |

Passwörter/Benutzernamen können jederzeit über `npm run db:seed` (mit angepassten Umgebungsvariablen, siehe `.env.example`) oder direkt in der Datenbank geändert werden. Die Datenbankstruktur unterstützt beliebig viele weitere Lehrer-Accounts (`User`-Tabelle, Rolle `TEACHER`).

## Lokale Entwicklung

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Datenbank einrichten

Für die lokale Entwicklung reicht eine lokale Prisma-Postgres-Instanz (kein Docker/Account nötig):

```bash
npx prisma dev
```

Das gibt eine `DATABASE_URL` aus – diese in `.env` eintragen (siehe `.env.example`). Danach Migrationen anwenden und Testnutzer anlegen:

```bash
npm run db:migrate
npm run db:seed
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

App läuft unter [http://localhost:3000](http://localhost:3000).

## Wichtige Skripte

| Befehl                | Zweck                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run dev`           | Entwicklungsserver                                                |
| `npm run build`         | Produktions-Build (führt automatisch `prisma migrate deploy` aus) |
| `npm run start`         | Produktionsserver starten (nach `build`)                          |
| `npm run db:migrate`    | Neue Migration lokal erstellen/anwenden                           |
| `npm run db:seed`       | Schüler-/Lehrer-Testkonten anlegen bzw. aktualisieren             |
| `npm run db:studio`     | Prisma Studio (Datenbank-GUI) öffnen                              |

## Konfiguration anpassen

Zwei zentrale Konfigurationsdateien steuern Fächer und Lektionenzeiten, ohne dass der restliche Code angepasst werden muss:

- [`src/lib/config/subjects.ts`](src/lib/config/subjects.ts) – Fächerliste inkl. Abkürzungen
- [`src/lib/config/lessons.ts`](src/lib/config/lessons.ts) – die 13 Lektionenzeiten (inkl. der bewusst unveränderten Überschneidung bei Lektion 8/9)

## Deployment (z. B. Vercel + Neon)

1. **Postgres-Datenbank erstellen**, z. B. bei [Neon](https://neon.tech) (kostenloser Tier reicht) oder [Supabase](https://supabase.com). Connection-String kopieren.
2. **Projekt zu einem Git-Repository pushen** (GitHub/GitLab).
3. Bei [Vercel](https://vercel.com) ein neues Projekt aus dem Repository erstellen.
4. **Umgebungsvariablen in Vercel setzen** (Project Settings → Environment Variables):
   - `DATABASE_URL` – Connection-String der Postgres-Datenbank (Schritt 1)
   - `AUTH_SECRET` – zufälliger, geheimer Wert (lokal erzeugen mit `npx auth secret`)
5. **Deploy auslösen.** Der Build-Befehl (`npm run build`) führt automatisch `prisma generate` und `prisma migrate deploy` aus – die Datenbanktabellen werden beim ersten Deploy angelegt.
6. **Einmalig Testnutzer anlegen:** lokal `DATABASE_URL` auf die Produktionsdatenbank setzen und `npm run db:seed` ausführen (oder eigene Werte über `SEED_*`-Variablen aus `.env.example`).

Danach ist die App unter der von Vercel vergebenen URL öffentlich erreichbar.

## Sicherheit

- Passwörter werden nie im Klartext gespeichert (bcrypt-Hash).
- Alle schreibenden Aktionen (Prüfung erstellen/bearbeiten/löschen) prüfen serverseitig die Rolle der eingeloggten Person – unabhängig von der UI, auch bei direkten Anfragen.
- Lehrer-Bereiche (`/lehrer/*`) sind zusätzlich über die Middleware (`src/proxy.ts`) für Schüler-Accounts gesperrt.
