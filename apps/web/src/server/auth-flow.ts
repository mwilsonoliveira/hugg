import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { authIntentSchema } from '@hugg/schemas';

export const FLOW_COOKIE = 'hugg_auth_flow';
export const FLOW_TTL = 600;
export const FLOW_OPTIONS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: FLOW_TTL };
const shared = { id: z.string(), next: z.string(), source: z.string(), intent: authIntentSchema };
const flowSchema = z.discriminatedUnion('phase', [
  z.object({ ...shared, phase: z.literal('oauth'), state: z.string(), nonce: z.string(), verifier: z.string(), expiresAt: z.number() }),
  z.object({ ...shared, phase: z.literal('link'), userId: z.string(), subject: z.string(), email: z.string().email(), expiresAt: z.number() }),
]);
export type AuthFlow = z.infer<typeof flowSchema>;
type NewFlow = AuthFlow extends infer T ? T extends AuthFlow ? Omit<T, 'expiresAt'> : never : never;
const key = (secret: string) => createHash('sha256').update('hugg-oauth-v1:' + secret).digest();
export function sealFlow(flow: NewFlow, secret: string, now = Date.now()): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify({ ...flow, expiresAt: now + FLOW_TTL * 1000 })), cipher.final()]);
  return [iv, body, cipher.getAuthTag()].map(part => part.toString('base64url')).join('.');
}
export function openFlow(value: string | undefined, secret: string, now = Date.now()): AuthFlow | null {
  if (!value) return null;
  try {
    const parts = value.split('.');
    if (parts.length !== 3) return null;
    const [iv, body, tag] = parts.map(part => Buffer.from(part, 'base64url'));
    const decipher = createDecipheriv('aes-256-gcm', key(secret), iv!);
    decipher.setAuthTag(tag!);
    const flow = flowSchema.parse(JSON.parse(Buffer.concat([decipher.update(body!), decipher.final()]).toString()));
    return flow.expiresAt > now ? flow : null;
  } catch { return null; }
}
export function validGoogleClaims(value: unknown, nonce: string) {
  const claims = z.object({ sub: z.string().min(1), email: z.string().email(), email_verified: z.literal(true), nonce: z.literal(nonce), name: z.string().optional() }).parse(value);
  return { subject: claims.sub, email: claims.email.trim().toLowerCase(), name: claims.name?.trim() || 'Usuário Hugg' };
}
