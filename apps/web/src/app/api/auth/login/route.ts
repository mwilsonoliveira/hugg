import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS, login } from "@/server/auth";
import { routeError } from "@/server/http";

export async function POST(request: NextRequest) {
  try {
    const result = await login(await request.json());
    const response = NextResponse.json(result);
    response.cookies.set(AUTH_COOKIE, result.token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    return routeError(error);
  }
}
