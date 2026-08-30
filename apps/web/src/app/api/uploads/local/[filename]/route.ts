import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  contentTypeForFilename,
  localUploadPath,
  localUploadsEnabled,
} from "@/server/local-uploads";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { filename: string } }) {
  if (!localUploadsEnabled()) return new NextResponse(null, { status: 404 });

  try {
    const file = await readFile(localUploadPath(params.filename));
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypeForFilename(params.filename),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
