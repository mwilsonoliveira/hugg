import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { loginSchema, registerUserSchema } from "@hugg/schemas";
import { sendOtpEmail } from "../lib/email";

const JWT_SECRET = process.env.JWT_SECRET ?? "hugg-jwt-secret-dev";
const JWT_EXPIRES_IN = "7d";
const WEB_URL = process.env.WEB_URL ?? "http://localhost:3000";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
const API_URL = process.env.API_URL ?? "http://localhost:3001";

function signToken(user: { id: string; name: string; email: string; avatarUrl?: string | null }) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? null },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function generateOtp(): string {
  return String(Math.floor(100000 + crypto.randomInt(900000)));
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
    await prisma.user.create({
      data: { name, email, passwordHash, phone, emailVerified: false },
    });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.deleteMany({ where: { email } });
    await prisma.emailVerification.create({ data: { email, code, expiresAt } });

    try {
      await sendOtpEmail(email, code);
    } catch {
      app.log.warn(`Failed to send OTP email to ${email}`);
    }

    return reply.status(201).send({ email });
  });

  app.post("/auth/verify-otp", async (request, reply) => {
    const { email, code } = request.body as { email: string; code: string };
    if (!email || !code) {
      return reply.status(400).send({ error: "E-mail e código são obrigatórios" });
    }

    const verification = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!verification) {
      return reply.status(400).send({ error: "Código não encontrado. Solicite um novo." });
    }

    if (verification.expiresAt < new Date()) {
      await prisma.emailVerification.delete({ where: { id: verification.id } });
      return reply.status(400).send({ error: "Código expirado. Solicite um novo." });
    }

    if (verification.code !== code) {
      return reply.status(400).send({ error: "Código inválido" });
    }

    await prisma.emailVerification.delete({ where: { id: verification.id } });
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    const token = signToken(user);
    return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  app.post("/auth/resend-otp", async (request, reply) => {
    const { email } = request.body as { email: string };
    if (!email) return reply.status(400).send({ error: "E-mail é obrigatório" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(404).send({ error: "Usuário não encontrado" });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.deleteMany({ where: { email } });
    await prisma.emailVerification.create({ data: { email, code, expiresAt } });

    try {
      await sendOtpEmail(email, code);
    } catch {
      app.log.warn(`Failed to resend OTP email to ${email}`);
    }

    return reply.send({ message: "Código reenviado" });
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

  // Google OAuth
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    app.get("/auth/google", async (request, reply) => {
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${API_URL}/api/auth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account",
      });
      return reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    });

    app.get("/auth/google/callback", async (request, reply) => {
      const { code, error } = request.query as { code?: string; error?: string };

      if (error || !code) {
        return reply.redirect(`${WEB_URL}/login?error=google_auth_failed`);
      }

      try {
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: `${API_URL}/api/auth/google/callback`,
            grant_type: "authorization_code",
          }),
        });

        const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
        if (!tokenData.access_token) {
          return reply.redirect(`${WEB_URL}/login?error=google_auth_failed`);
        }

        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const googleUser = await userInfoRes.json() as {
          id: string; email: string; name: string; picture?: string;
        };

        let user = await prisma.user.findFirst({
          where: { OR: [{ googleId: googleUser.id }, { email: googleUser.email }] },
        });

        const isNewLink = !!user && !user.googleId;

        if (user) {
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: googleUser.id, emailVerified: true, avatarUrl: googleUser.picture ?? user.avatarUrl },
            });
          }
        } else {
          user = await prisma.user.create({
            data: {
              name: googleUser.name,
              email: googleUser.email,
              passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
              googleId: googleUser.id,
              emailVerified: true,
              avatarUrl: googleUser.picture,
            },
          });
        }

        const jwtToken = signToken(user);
        const linkedParam = isNewLink ? "&linked=true" : "";
        return reply.redirect(`${WEB_URL}/auth/google/callback?token=${jwtToken}${linkedParam}`);
      } catch {
        return reply.redirect(`${WEB_URL}/login?error=google_auth_failed`);
      }
    });
  }
}
