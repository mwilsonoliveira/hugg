import { NextResponse, type NextRequest } from "next/server";
import { getPet, updatePet } from "@/server/pets";
import { requireRequestUser } from "@/server/request-auth";
import { routeError } from "@/server/http";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try { return NextResponse.json(await getPet(params.id)); }
  catch (error) { return routeError(error); }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRequestUser(request);
    return NextResponse.json(await updatePet(params.id, await request.json(), user.id));
  } catch (error) { return routeError(error); }
}
