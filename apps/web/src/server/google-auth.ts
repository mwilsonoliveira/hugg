import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@hugg/database';
import { cookies } from 'next/headers';
import { authIntentSchema } from '@hugg/schemas';
import { safeReturnTo } from '../lib/auth-navigation';
import { jwtSecret } from './auth';
import { FLOW_COOKIE, FLOW_TTL, openFlow, validGoogleClaims, type AuthFlow } from './auth-flow';

export function googleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) return null;
  try {
    const uri = new URL(redirectUri);
    if (uri.pathname !== '/api/auth/google/callback' || uri.search || uri.hash || uri.username || uri.password) return null;
    if (uri.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && uri.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(uri.hostname))) return null;
    return { clientId, clientSecret, redirectUri, origin: uri.origin };
  } catch { return null; }
}
export const googleEnabled = () => googleConfig() !== null;
export const readAuthFlow = () => {
  const value = cookies().get(FLOW_COOKIE)?.value;
  return value ? openFlow(value, jwtSecret()) : null;
};
export async function createAttempt() {
  await prisma.authAttempt.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  const id = randomUUID();
  await prisma.authAttempt.create({ data: { id, expiresAt: new Date(Date.now() + FLOW_TTL * 1000) } });
  return id;
}
export async function startGoogle(params: URLSearchParams) {
  const config = googleConfig();
  if (!config) throw new Error('Google indisponível');
  const client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri);
  const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
  const flow = {
    phase: 'oauth' as const, id: await createAttempt(), state: randomBytes(32).toString('base64url'), nonce: randomBytes(32).toString('base64url'), verifier: codeVerifier,
    next: safeReturnTo(params.get('next')), source: safeAuthSource(params.get('source')), intent: authIntentSchema.catch('sign-in').parse(params.get('intent')),
  };
  const url = client.generateAuthUrl({ scope: ['openid', 'email', 'profile'], state: flow.state, nonce: flow.nonce, code_challenge: codeChallenge, code_challenge_method: 'S256' as import('google-auth-library').CodeChallengeMethod });
  return { flow, url };
}
export function safeAuthSource(value: unknown) {
  if (value === '/login') return '/login';
  const safe = safeReturnTo(value);
  // Remove callback UI flags before storing a new origin context.
  const url = new URL(safe, 'https://hugg.invalid');
  url.searchParams.delete('auth');
  return url.pathname + url.search + url.hash;
}
export async function consumeOAuth(flow: Extract<AuthFlow, { phase: 'oauth' }>, state: string | null) {
  if (!state || state.length !== flow.state.length || !timingSafeEqual(Buffer.from(state), Buffer.from(flow.state))) throw new Error('Invalid OAuth state');
  const consumed = await prisma.authAttempt.deleteMany({ where: { id: flow.id, expiresAt: { gt: new Date() } } });
  if (!consumed.count) throw new Error('Expired OAuth attempt');
}
export async function exchangeGoogleCode(code: string, flow: Extract<AuthFlow, { phase: 'oauth' }>) {
  const config = googleConfig();
  if (!config) throw new Error('Google indisponível');
  const client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri);
  const { tokens } = await client.getToken({ code, codeVerifier: flow.verifier, redirect_uri: config.redirectUri });
  if (!tokens.id_token) throw new Error('Missing ID token');
  const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId });
  return validGoogleClaims(ticket.getPayload(), flow.nonce);
}
