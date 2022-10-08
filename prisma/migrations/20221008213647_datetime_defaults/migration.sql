-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SpySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME
);
INSERT INTO "new_SpySession" ("endTime", "id", "startTime") SELECT "endTime", "id", "startTime" FROM "SpySession";
DROP TABLE "SpySession";
ALTER TABLE "new_SpySession" RENAME TO "SpySession";
CREATE TABLE "new_Recording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Recording_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SpySession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recording" ("endTime", "id", "sessionId", "startTime") SELECT "endTime", "id", "sessionId", "startTime" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
