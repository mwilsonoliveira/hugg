import { redirect } from "next/navigation";
import { loginHref } from "./auth-navigation";
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

/** Authentication for restricted pages; API authorization remains independent. */
export async function requirePageUser(returnTo: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(loginHref(returnTo));
  return user;
}
