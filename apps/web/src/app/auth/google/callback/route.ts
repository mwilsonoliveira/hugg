import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const baseUrl = new URL(request.url).origin;

  if (error || !token) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
  }

  const cookieStore = await cookies();
  cookieStore.set("token", token, COOKIE_OPTIONS);
  return NextResponse.redirect(`${baseUrl}/`);
}
