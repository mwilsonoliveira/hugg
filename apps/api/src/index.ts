import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { petsRoutes } from "./routes/pets";
import { breedsRoutes } from "./routes/breeds";
import { searchesRoutes } from "./routes/searches";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: process.env.WEB_URL ?? "http://localhost:3000",
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.register(petsRoutes, { prefix: "/api" });
app.register(breedsRoutes, { prefix: "/api" });
app.register(searchesRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT ?? 3001), host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
