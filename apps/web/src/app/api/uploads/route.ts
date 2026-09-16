import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { NextResponse, type NextRequest } from "next/server";
import { requestUser } from "@/server/request-auth";

export async function POST(request: NextRequest) {
  const user = await requestUser(request);
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = (await request.json()) as HandleUploadPresignedBody;
    const response = await handleUploadPresigned({
      body,
      request,
      webhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY,
      getSignedToken: async (pathname) => ({
        token: await issueSignedToken({
          pathname,
          operations: ["put"],
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 5 * 1024 * 1024,
        }),
        urlOptions: {
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id, pathname }),
        },
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível enviar a imagem" }, { status: 400 });
  }
}
