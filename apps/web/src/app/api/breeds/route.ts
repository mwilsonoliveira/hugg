import { NextResponse, type NextRequest } from "next/server";
import { BREEDS_BY_SPECIES, speciesSchema } from "@hugg/schemas";

export function GET(request: NextRequest) {
  const species = request.nextUrl.searchParams.get("species");
  if (!species) return NextResponse.json({ breeds: BREEDS_BY_SPECIES });
  const parsed = speciesSchema.safeParse(species);
  return parsed.success
    ? NextResponse.json({ breeds: BREEDS_BY_SPECIES[parsed.data] })
    : NextResponse.json({ error: "Espécie inválida" }, { status: 400 });
}
