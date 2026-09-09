CREATE TABLE "new_User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT,
  "googleSubject" TEXT,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
--> statement-breakpoint
INSERT INTO "new_User" ("id", "name", "email", "passwordHash", "phone", "avatarUrl", "createdAt", "updatedAt")
SELECT "id", "name", "email", "passwordHash", "phone", "avatarUrl", "createdAt", "updatedAt" FROM "User";
--> statement-breakpoint
DROP TABLE "User";
--> statement-breakpoint
ALTER TABLE "new_User" RENAME TO "User";
--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
--> statement-breakpoint
CREATE UNIQUE INDEX "User_googleSubject_key" ON "User"("googleSubject");
--> statement-breakpoint
CREATE TABLE "AuthAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" DATETIME NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE INDEX "AuthAttempt_expiresAt_idx" ON "AuthAttempt"("expiresAt");
