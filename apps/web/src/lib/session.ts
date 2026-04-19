import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  exp: number;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = jwtDecode<JWTPayload>(token);
    if (!payload.sub || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { id: payload.sub, name: payload.name, email: payload.email, avatarUrl: payload.avatarUrl };
  } catch {
    return null;
  }
}
