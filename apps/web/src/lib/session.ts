import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyToken } from "@/server/auth";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(AUTH_COOKIE)?.value);
}
