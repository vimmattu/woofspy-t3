/*
  Warnings:

  - Added the required column `userId` to the `SpySession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Recording_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SpySession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Recording" ("endTime", "id", "sessionId", "startTime") SELECT "endTime", "id", "sessionId", "startTime" FROM "Recording";
DROP TABLE "Recording";
ALTER TABLE "new_Recording" RENAME TO "Recording";
CREATE TABLE "new_SpySession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SpySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SpySession" ("endTime", "id", "startTime") SELECT "endTime", "id", "startTime" FROM "SpySession";
DROP TABLE "SpySession";
ALTER TABLE "new_SpySession" RENAME TO "SpySession";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
