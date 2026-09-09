CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Pet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "nameNormalized" TEXT,
  "species" TEXT NOT NULL,
  "breed" TEXT,
  "breedNormalized" TEXT,
  "age" INTEGER,
  "description" TEXT,
  "imageUrls" JSONB NOT NULL DEFAULT '[]',
  "gender" TEXT,
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "situation" TEXT NOT NULL DEFAULT 'SHELTER',
  "waitingSince" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "latitude" REAL,
  "longitude" REAL,
  "locationNote" TEXT,
  "locationPhone" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "createdById" TEXT NOT NULL,
  CONSTRAINT "Pet_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
--> statement-breakpoint
CREATE TABLE "SearchHistory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "query" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 1,
  "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "Adoption" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "message" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "petId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Adoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
--> statement-breakpoint
CREATE UNIQUE INDEX "SearchHistory_query_key" ON "SearchHistory"("query");
--> statement-breakpoint
CREATE INDEX "Pet_createdById_idx" ON "Pet"("createdById");
--> statement-breakpoint
CREATE INDEX "Pet_species_status_idx" ON "Pet"("species", "status");
--> statement-breakpoint
CREATE INDEX "Pet_nameNormalized_idx" ON "Pet"("nameNormalized");
--> statement-breakpoint
CREATE INDEX "Pet_breedNormalized_idx" ON "Pet"("breedNormalized");
--> statement-breakpoint
CREATE INDEX "Adoption_petId_idx" ON "Adoption"("petId");
--> statement-breakpoint
CREATE INDEX "Adoption_userId_idx" ON "Adoption"("userId");
