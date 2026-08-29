import { NextResponse, type NextRequest } from "next/server";
import { listSearches, recordSearchValue } from "@/server/searches";
import { routeError } from "@/server/http";

export async function GET() {
  try { return NextResponse.json({ searches: await listSearches() }); }
  catch (error) { return routeError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(await recordSearchValue(body.query), { status: 201 });
  } catch (error) { return routeError(error); }
}
