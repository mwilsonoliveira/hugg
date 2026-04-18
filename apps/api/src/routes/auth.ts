import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { loginSchema, registerUserSchema } from "@hugg/schemas";

const JWT_SECRET = process.env.JWT_SECRET ?? "hugg-jwt-secret-dev";
const JWT_EXPIRES_IN = "7d";

function signToken(user: { id: string; name: string; email: string }) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const body = registerUserSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { name, email, password, phone } = body.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ error: "E-mail já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, phone },
    });

    const token = signToken(user);
    return reply.status(201).send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  app.post("/auth/login", async (request, reply) => {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({ error: body.error.flatten() });
    }

    const { email, password } = body.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: "Credenciais inválidas" });
    }

    const token = signToken(user);
    return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  app.get("/auth/me", async (request, reply) => {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Não autenticado" });
    }

    try {
      const token = authorization.slice(7);
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string; name: string; email: string };
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return reply.status(401).send({ error: "Usuário não encontrado" });
      return reply.send({ id: user.id, name: user.name, email: user.email });
    } catch {
      return reply.status(401).send({ error: "Token inválido" });
    }
  });
}
