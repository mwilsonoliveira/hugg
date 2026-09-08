import { NextResponse, type NextRequest } from "next/server";
import { createPet, listPets } from "@/server/pets";
import { requireRequestUser } from "@/server/request-auth";
import { routeError } from "@/server/http";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await listPets(Object.fromEntries(request.nextUrl.searchParams)));
  } catch (error) { return routeError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRequestUser(request);
    return NextResponse.json(await createPet(await request.json(), user.id), { status: 201 });
  } catch (error) { return routeError(error); }
}
