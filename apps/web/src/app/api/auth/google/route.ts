import { NextResponse, type NextRequest } from 'next/server';
import { startGoogle, googleConfig } from '@/server/google-auth';
import { sealFlow, FLOW_COOKIE, FLOW_OPTIONS } from '@/server/auth-flow';
import { jwtSecret } from '@/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const config = googleConfig();
  if (!config) return NextResponse.json({ error: 'Google indisponível. Entre com e-mail.' }, { status: 503 });
  // Callback cookies must remain on the configured application origin.
  if (request.nextUrl.origin !== config.origin) return NextResponse.json({ error: 'Google indisponível neste endereço.' }, { status: 400 });
  try {
    const { flow, url } = await startGoogle(request.nextUrl.searchParams);
    const response = NextResponse.redirect(url);
    response.cookies.set(FLOW_COOKIE, sealFlow(flow, jwtSecret()), FLOW_OPTIONS);
    return response;
  } catch {
    return NextResponse.redirect(new URL('/login?auth=google-error', config.origin));
  }
}
