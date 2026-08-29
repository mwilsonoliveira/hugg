-- Adiciona enum Gender
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- Adiciona passwordHash em User (vazio temporariamente para permitir UPDATE antes de setar NOT NULL)
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';

-- Atualiza seed users com hash de 'hugg@123'
UPDATE "User"
SET "passwordHash" = '$2b$10$vC3r0tb0RYkDnX20TMfiNeFbTpSqVmNLzGryST5Q9rQiUasT9LyBy'
WHERE id IN ('seed-user-ana', 'seed-user-joao');

-- Remove o default após preenchimento
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;

-- Adiciona colunas faltantes em Pet
ALTER TABLE "Pet"
  ADD COLUMN "gender"        "Gender",
  ADD COLUMN "locationNote"  TEXT,
  ADD COLUMN "locationPhone" TEXT;

-- Torna Pet.name nullable (schema atual define name String?)
ALTER TABLE "Pet" ALTER COLUMN "name" DROP NOT NULL;
