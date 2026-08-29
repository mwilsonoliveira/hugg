import { normalizeSearchText, prisma } from "@hugg/database";
import { AppError } from "./errors";

export async function listSearches() {
  return prisma.searchHistory.findMany({ orderBy: { lastUsed: "desc" }, take: 10, select: { query: true, count: true } });
}

export async function recordSearchValue(value: unknown) {
  if (typeof value !== "string" || value.trim().length < 2) throw new AppError(400, "Pesquisa muito curta");
  const query = normalizeSearchText(value)!;
  return prisma.searchHistory.upsert({ where: { query }, update: { count: { increment: 1 }, lastUsed: new Date() }, create: { query } });
}
