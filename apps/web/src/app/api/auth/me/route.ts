import { NextResponse, type NextRequest } from "next/server";
import { requestUser } from "@/server/request-auth";

export async function GET(request: NextRequest) {
  const user = await requestUser(request);
  return user ? NextResponse.json(user) : NextResponse.json({ error: "Não autenticado" }, { status: 401 });
}
