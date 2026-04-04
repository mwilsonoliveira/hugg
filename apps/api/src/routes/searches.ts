import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function searchesRoutes(app: FastifyInstance) {
  // Retorna as 10 pesquisas mais recentes/populares
  app.get("/searches", async (_request, reply) => {
    const searches = await prisma.searchHistory.findMany({
      orderBy: [{ lastUsed: "desc" }],
      take: 10,
      select: { query: true, count: true },
    });
    return reply.send({ searches });
  });

  // Registra ou incrementa uma pesquisa
  app.post("/searches", async (request, reply) => {
    const { query } = request.body as { query?: string };

    if (!query || query.trim().length < 2) {
      return reply.status(400).send({ error: "Pesquisa muito curta" });
    }

    const normalized = query.trim().toLowerCase();

    const search = await prisma.searchHistory.upsert({
      where: { query: normalized },
      update: { count: { increment: 1 }, lastUsed: new Date() },
      create: { query: normalized },
    });

    return reply.status(201).send(search);
  });
}
