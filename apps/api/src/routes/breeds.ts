import type { FastifyInstance } from "fastify";
import { BREEDS_BY_SPECIES, speciesSchema } from "@hugg/schemas";

export async function breedsRoutes(app: FastifyInstance) {
  app.get("/breeds", async (request, reply) => {
    const query = request.query as { species?: string };

    if (query.species) {
      const parsed = speciesSchema.safeParse(query.species);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Espécie inválida" });
      }
      return reply.send({ breeds: BREEDS_BY_SPECIES[parsed.data] });
    }

    return reply.send({ breeds: BREEDS_BY_SPECIES });
  });
}
