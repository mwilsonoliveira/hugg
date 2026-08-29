import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { requestUser } from "@/server/request-auth";

export async function POST(request: NextRequest) {
  const user = await requestUser(request);
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
        maximumSizeInBytes: 5 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ userId: user.id, pathname }),
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível enviar a imagem" }, { status: 400 });
  }
}
