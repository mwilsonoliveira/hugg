import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { petsRoutes } from "./routes/pets";
import { breedsRoutes } from "./routes/breeds";
import { searchesRoutes } from "./routes/searches";

const app = Fastify({ logger: true, bodyLimit: 10 * 1024 * 1024 });

app.register(cors, {
  origin: process.env.WEB_URL ?? "http://localhost:3000",
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.register(petsRoutes, { prefix: "/api" });
app.register(breedsRoutes, { prefix: "/api" });
app.register(searchesRoutes, { prefix: "/api" });

export default app;
