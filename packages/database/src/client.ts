import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const localUrl = process.cwd().replaceAll("\\", "/").endsWith("/apps/web")
    ? "file:../../packages/database/prisma/dev.db"
    : process.cwd().replaceAll("\\", "/").endsWith("/packages/database")
      ? "file:./prisma/dev.db"
      : "file:./packages/database/prisma/dev.db";
  const url = process.env.TURSO_DATABASE_URL ?? localUrl;
  const adapter = new PrismaLibSql({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
