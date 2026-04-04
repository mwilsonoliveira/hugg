import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { listPetsQuerySchema } from "@hugg/schemas";

export async function petsRoutes(app: FastifyInstance) {
  app.get("/pets", async (request, reply) => {
    const query = listPetsQuerySchema.safeParse(request.query);

    if (!query.success) {
      return reply.status(400).send({ error: query.error.flatten() });
    }

    const { search, waitingFilter, page, limit } = query.data;

    const now = new Date();
    let waitingSinceAfter: Date | undefined;
    let waitingSinceBefore: Date | undefined;

    if (waitingFilter) {
      if (waitingFilter === "90+") {
        waitingSinceBefore = new Date(now);
        waitingSinceBefore.setDate(waitingSinceBefore.getDate() - 90);
      } else {
        const days = parseInt(waitingFilter);
        waitingSinceAfter = new Date(now);
        waitingSinceAfter.setDate(waitingSinceAfter.getDate() - days);
      }
    }

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { breed: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(waitingSinceAfter
        ? { waitingSince: { gte: waitingSinceAfter } }
        : {}),
      ...(waitingSinceBefore
        ? { waitingSince: { lte: waitingSinceBefore } }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.pet.findMany({
        where,
        orderBy: { waitingSince: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pet.count({ where }),
    ]);

    return reply.send({ data, total, page, limit });
  });
}
