import type { NextRequest } from "next/server";
import { AUTH_COOKIE, verifyToken } from "./auth";
import { AppError } from "./errors";

export async function requestUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const bearer = authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
  return verifyToken(bearer ?? request.cookies.get(AUTH_COOKIE)?.value);
}

export async function requireRequestUser(request: NextRequest) {
  const user = await requestUser(request);
  if (!user) throw new AppError(401, "Não autenticado");
  return user;
}
