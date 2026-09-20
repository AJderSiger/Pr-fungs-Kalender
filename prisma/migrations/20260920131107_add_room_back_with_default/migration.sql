-- Raum wieder hinzufügen, diesmal mit Standardwert "403" statt optional.
ALTER TABLE "exams" ADD COLUMN "room" TEXT NOT NULL DEFAULT '403';
