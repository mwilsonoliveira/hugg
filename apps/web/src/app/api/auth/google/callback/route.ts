import { NextResponse, type NextRequest } from 'next/server';
import { googleConfig, consumeOAuth, exchangeGoogleCode, createAttempt } from '@/server/google-auth';
import { resolveGoogleAccount } from '@/server/google-accounts';
import { FLOW_COOKIE, FLOW_OPTIONS, openFlow, sealFlow } from '@/server/auth-flow';
import { AUTH_COOKIE, AUTH_COOKIE_OPTIONS, jwtSecret } from '@/server/auth';
import { safeReturnTo } from '@/lib/auth-navigation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const config = googleConfig();
  if (!config) return NextResponse.json({ error: 'Google indisponível. Entre com e-mail.' }, { status: 503 });
  const flow = openFlow(request.cookies.get(FLOW_COOKIE)?.value, jwtSecret());
  const feedback = (status: string) => {
    const url = new URL(flow?.source ?? '/login', config.origin);
    url.searchParams.set('auth', status);
    url.searchParams.set('next', safeReturnTo(flow?.next));
    url.searchParams.set('intent', flow?.intent ?? 'sign-in');
    const response = NextResponse.redirect(url);
    response.cookies.delete(FLOW_COOKIE);
    return response;
  };
  if (!flow || flow.phase !== 'oauth') return feedback('google-error');
  try {
    await consumeOAuth(flow, request.nextUrl.searchParams.get('state'));
    if (request.nextUrl.searchParams.has('error')) return feedback('google-cancelled');
    const code = request.nextUrl.searchParams.get('code');
    if (!code) return feedback('google-error');
    const identity = await exchangeGoogleCode(code, flow);
    const result = await resolveGoogleAccount(identity);
    if (result.kind === 'link') {
      const response = feedback('google-link');
      response.cookies.set(FLOW_COOKIE, sealFlow({ phase: 'link', id: await createAttempt(), userId: result.userId, subject: identity.subject, email: result.email, next: flow.next, source: flow.source, intent: flow.intent }, jwtSecret()), FLOW_OPTIONS);
      return response;
    }
    const response = NextResponse.redirect(new URL(safeReturnTo(flow.next), config.origin));
    response.cookies.delete(FLOW_COOKIE);
    response.cookies.set(AUTH_COOKIE, result.token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch {
    // Never log authorization codes, credentials or provider responses.
    return feedback('google-error');
  }
}
