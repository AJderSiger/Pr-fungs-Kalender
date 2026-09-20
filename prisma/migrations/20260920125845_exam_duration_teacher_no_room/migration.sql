-- Prüfungsdauer statt Lektions-Ende, echter Fachlehrername statt Raum.
-- Bestehende Zeilen werden aus den bisherigen Lektionsangaben zurückgerechnet,
-- damit keine Daten verloren gehen.

-- 1. Neue Spalten hinzufügen
ALTER TABLE "exams" ADD COLUMN "durationMinutes" INTEGER NOT NULL DEFAULT 45;
ALTER TABLE "exams" ADD COLUMN "teacherName" TEXT;

-- 2. Dauer in Minuten aus den bisherigen Lektionsgrenzen zurückrechnen
--    (Zeiten gemäss src/lib/config/lessons.ts)
UPDATE "exams" SET "durationMinutes" =
  (CASE "lessonEnd"
     WHEN 1 THEN 505 WHEN 2 THEN 555 WHEN 3 THEN 620 WHEN 4 THEN 670 WHEN 5 THEN 720
     WHEN 6 THEN 770 WHEN 7 THEN 825 WHEN 8 THEN 885 WHEN 9 THEN 925 WHEN 10 THEN 985
     WHEN 11 THEN 1035 WHEN 12 THEN 1095 WHEN 13 THEN 1145 ELSE 505
   END)
  -
  (CASE "lessonStart"
     WHEN 1 THEN 460 WHEN 2 THEN 510 WHEN 3 THEN 575 WHEN 4 THEN 625 WHEN 5 THEN 675
     WHEN 6 THEN 725 WHEN 7 THEN 780 WHEN 8 THEN 830 WHEN 9 THEN 880 WHEN 10 THEN 940
     WHEN 11 THEN 990 WHEN 12 THEN 1050 WHEN 13 THEN 1100 ELSE 460
   END);

-- 3. Fachlehrername aus dem Fach ableiten (gemäss src/lib/config/teachers.ts)
UPDATE "exams" SET "teacherName" = CASE "subjectCode"
  WHEN 'D' THEN 'Jevaire Crameri'
  WHEN 'E' THEN 'Corinne Blaser-Koll'
  WHEN 'F' THEN 'Jevaire Crameri'
  WHEN 'FRW' THEN 'Juliette Merath'
  WHEN 'G&P' THEN 'Marc Roobol'
  WHEN 'M' THEN 'Susanne Stolle'
  WHEN 'S' THEN 'Christian Mauch'
  WHEN 'TDA' THEN 'Roger Marti'
  WHEN 'W&R' THEN 'Juliette Merath'
  ELSE 'Unbekannt'
END
WHERE "teacherName" IS NULL;

ALTER TABLE "exams" ALTER COLUMN "teacherName" SET NOT NULL;

-- 4. Nicht mehr benötigte Spalten entfernen
ALTER TABLE "exams" DROP COLUMN "room";
ALTER TABLE "exams" DROP COLUMN "lessonEnd";
