import { NextResponse, type NextRequest } from "next/server";
import { nearbyPets } from "@/server/pets";
import { routeError } from "@/server/http";

export async function GET(request: NextRequest) {
  try { return NextResponse.json(await nearbyPets(Object.fromEntries(request.nextUrl.searchParams) as never)); }
  catch (error) { return routeError(error); }
}
