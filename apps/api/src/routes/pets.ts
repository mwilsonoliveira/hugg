import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { listPetsQuerySchema, createPetSchema, updatePetSchema, nearbyPetsQuerySchema } from "@hugg/schemas";
import { getDistanceKm } from "@hugg/utils";

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

  app.get("/pets/nearby", async (request, reply) => {
    const query = nearbyPetsQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.status(400).send({ error: query.error.flatten() });
    }

    const { lat, lng, radius, limit } = query.data;

    const petsWithLocation = await prisma.pet.findMany({
      where: { latitude: { not: null }, longitude: { not: null } },
    });

    const nearby = petsWithLocation
      .map((pet) => ({
        ...pet,
        distanceKm: getDistanceKm(lat, lng, pet.latitude!, pet.longitude!),
      }))
      .filter((p) => p.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);

    return reply.send(nearby);
  });

  app.get("/pets/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const pet = await prisma.pet.findUnique({ where: { id } });

    if (!pet) {
      return reply.status(404).send({ error: "Pet não encontrado" });
    }

    return reply.send(pet);
  });

  app.post("/pets", async (request, reply) => {
    const body = createPetSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    // Busca o primeiro usuário disponível (temporário, sem autenticação)
    const user = await prisma.user.findFirst();
    if (!user) {
      return reply.status(500).send({ error: "Nenhum usuário encontrado" });
    }

    const pet = await prisma.pet.create({
      data: {
        ...body.data,
        createdById: user.id,
      },
    });

    return reply.status(201).send(pet);
  });

  app.patch("/pets/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const body = updatePetSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const existing = await prisma.pet.findUnique({ where: { id } });
    if (!existing) {
      return reply.status(404).send({ error: "Pet não encontrado" });
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: body.data,
    });

    return reply.send(pet);
  });
}
