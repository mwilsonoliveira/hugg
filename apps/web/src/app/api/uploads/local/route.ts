import { mkdir, writeFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { requireRequestUser } from "@/server/request-auth";
import { AppError } from "@/server/errors";
import {
  LOCAL_UPLOAD_TYPES,
  createLocalUploadName,
  localUploadsDirectory,
  localUploadsEnabled,
  validateLocalUpload,
} from "@/server/local-uploads";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!localUploadsEnabled()) return NextResponse.json({ error: "Upload local indisponível" }, { status: 404 });

  try {
    await requireRequestUser(request);
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Imagem não enviada" }, { status: 400 });

    validateLocalUpload(file);
    const filename = createLocalUploadName(file.type as keyof typeof LOCAL_UPLOAD_TYPES);
    const directory = localUploadsDirectory();
    await mkdir(directory, { recursive: true });
    await writeFile(`${directory}/${filename}`, Buffer.from(await file.arrayBuffer()), { flag: "wx" });

    return NextResponse.json({ url: `${request.nextUrl.origin}/api/uploads/local/${filename}` }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && (error.message.includes("Formato") || error.message.includes("5 MB"))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Não foi possível salvar a imagem" }, { status: 500 });
  }
}
