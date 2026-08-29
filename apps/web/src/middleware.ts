import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== "true" || request.nextUrl.pathname === "/health") {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Aplicação em manutenção" }, { status: 503 });
  }
  if (request.nextUrl.pathname === "/maintenance") return NextResponse.next();
  return NextResponse.rewrite(new URL("/maintenance", request.url));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
