import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@hugg/database";
import { loginSchema, registerUserSchema, type LoginInput, type RegisterUserInput } from "@hugg/schemas";
import { AppError } from "./errors";

const JWT_EXPIRES_IN = "7d";
export const AUTH_COOKIE = "token";
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET não configurado");
  }
  return secret ?? "hugg-jwt-secret-dev";
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export function signToken(user: AuthUser) {
  return jwt.sign({ sub: user.id, name: user.name, email: user.email }, jwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export async function verifyToken(token: string | undefined): Promise<AuthUser | null> {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret()) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  } catch {
    return null;
  }
}

export async function login(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    throw new AppError(401, "Credenciais inválidas");
  }
  const safeUser = { id: user.id, name: user.name, email: user.email };
  return { token: signToken(safeUser), user: safeUser };
}

export async function register(input: RegisterUserInput) {
  const parsed = registerUserSchema.safeParse(input);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());
  const email = parsed.data.email.trim().toLocaleLowerCase("pt-BR");
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new AppError(409, "E-mail já cadastrado");
  }
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      phone: parsed.data.phone,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
    },
  });
  const safeUser = { id: user.id, name: user.name, email: user.email };
  return { token: signToken(safeUser), user: safeUser };
}
