import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID, generateKeyPairSync } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

test('Google accounts, password proof, single-use context and signed ID tokens', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'hugg-google-'));
  process.env.TURSO_DATABASE_URL = `file:${dir}/test.db`;
  process.env.JWT_SECRET = 'isolated-test-secret';
  process.env.GOOGLE_CLIENT_ID = 'test-client';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret';
  process.env.GOOGLE_REDIRECT_URI = 'https://hugg.test/api/auth/google/callback';
  await import('../../../../packages/database/scripts/apply-migrations');
  const { prisma } = await import('@hugg/database');
  const { resolveGoogleAccount, confirmGoogleLink } = await import('./google-accounts');
  const { register, login, verifyToken } = await import('./auth');
  const { createAttempt, consumeOAuth, exchangeGoogleCode } = await import('./google-auth');
  try {
    const google = { subject: 'new-sub', email: 'new@test.com', name: 'New Google' };
    const created = await resolveGoogleAccount(google);
    assert.equal(created.kind, 'session');
    if (created.kind !== 'session') throw Error('Expected session');
    assert.ok(await verifyToken(created.token));
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: created.user.id } })).passwordHash, null);
    await assert.rejects(login({ email: google.email, password: 'wrong-password' }), /Credenciais inválidas/);
    const repeated = await resolveGoogleAccount({ ...google, email: 'changed@test.com' });
    assert.equal(repeated.kind === 'session' && repeated.user.id, created.user.id);
    const password = 'secure-password-123';
    const existing = await register({ name: 'Existing', email: 'existing@test.com', password });
    const originalHash = (await prisma.user.findUniqueOrThrow({ where: { id: existing.user.id } })).passwordHash;
    const pending = await resolveGoogleAccount({ subject: 'existing-sub', email: 'existing@test.com', name: 'Other name' });
    assert.equal(pending.kind, 'link');
    const flow = { phase: 'link' as const, id: await createAttempt(), userId: existing.user.id, subject: 'existing-sub', email: existing.user.email, next: '/pets/new', source: '/', intent: 'create' as const, expiresAt: Date.now() + 600000 };
    await assert.rejects(confirmGoogleLink(flow, 'wrong-password'), /Senha incorreta/);
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: existing.user.id } })).googleSubject, null);
    const results = await Promise.allSettled([confirmGoogleLink(flow, password), confirmGoogleLink(flow, password)]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    await assert.rejects(confirmGoogleLink(flow, password), /expirou/);
    const linked = await prisma.user.findUniqueOrThrow({ where: { id: existing.user.id } });
    assert.equal(linked.passwordHash, originalHash);
    assert.equal(linked.googleSubject, 'existing-sub');
    assert.ok(await login({ email: existing.user.email, password }));
    assert.equal((await resolveGoogleAccount({ subject: 'existing-sub', email: existing.user.email, name: 'Existing' })).kind, 'session');
    await assert.rejects(resolveGoogleAccount({ subject: 'other-sub', email: existing.user.email, name: 'Existing' }), /outro acesso/);
    const limited = { ...flow, id: await createAttempt() };
    for (let i = 0; i < 5; i++) await assert.rejects(confirmGoogleLink(limited, 'wrong-password'), /Senha incorreta/);
    await assert.rejects(confirmGoogleLink(limited, password), /expirou/);
    const expired = { ...flow, id: await createAttempt() };
    await prisma.authAttempt.update({ where: { id: expired.id }, data: { expiresAt: new Date(0) } });
    await assert.rejects(confirmGoogleLink(expired, password), /expirou/);

    const oauth = { phase: 'oauth' as const, id: await createAttempt(), state: randomUUID(), nonce: 'test-nonce', verifier: 'test-verifier', source: '/', next: '/pets/new', intent: 'create' as const, expiresAt: Date.now() + 600000 };
    await assert.rejects(consumeOAuth(oauth, 'wrong-state'));
    await consumeOAuth(oauth, oauth.state);
    await assert.rejects(consumeOAuth(oauth, oauth.state));

    // Simulate token exchange and Google's public keys, while retaining real JWT verification.
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const keyPem = publicKey.export({ type: 'spki', format: 'pem' });
    const sign = (changes = {}) => jwt.sign({ sub: 'verified-sub', email: 'verified@test.com', email_verified: true, nonce: oauth.nonce, aud: 'test-client', iss: 'https://accounts.google.com', ...changes }, privateKey, { algorithm: 'RS256', keyid: 'test-key', expiresIn: '5m' });
    let token = sign();
    const originalGetToken = OAuth2Client.prototype.getToken;
    const originalCerts = OAuth2Client.prototype.getFederatedSignonCertsAsync;
    OAuth2Client.prototype.getToken = (async () => ({ tokens: { id_token: token } })) as unknown as typeof originalGetToken;
    OAuth2Client.prototype.getFederatedSignonCertsAsync = (async () => ({ certs: { 'test-key': keyPem }, format: 'PEM' })) as unknown as typeof originalCerts;
    try {
      assert.equal((await exchangeGoogleCode('fake-code', oauth)).subject, 'verified-sub');
      for (const changes of [{ aud: 'wrong-client' }, { iss: 'https://evil.test' }, { nonce: 'wrong' }, { email_verified: false }]) {
        token = sign(changes);
        await assert.rejects(exchangeGoogleCode('fake-code', oauth));
      }
      token = sign().slice(0, -12) + 'invalid';
      await assert.rejects(exchangeGoogleCode('fake-code', oauth));
      token = jwt.sign({ sub: 'verified-sub', email: 'verified@test.com', email_verified: true, nonce: oauth.nonce, aud: 'test-client', iss: 'https://accounts.google.com', iat: Math.floor(Date.now() / 1000) - 7200, exp: Math.floor(Date.now() / 1000) - 3600 }, privateKey, { algorithm: 'RS256', keyid: 'test-key' });
      await assert.rejects(exchangeGoogleCode('fake-code', oauth));

      const { NextRequest } = await import('next/server');
      const { sealFlow } = await import('./auth-flow');
      const { GET: callback } = await import('../app/api/auth/google/callback/route');
      const invoke = async (context: typeof oauth, query: string) => callback(new NextRequest('https://hugg.test/api/auth/google/callback?' + query, { headers: { cookie: `hugg_auth_flow=${sealFlow(context, process.env.JWT_SECRET!)}` } }));
      const cancelled = { ...oauth, id: await createAttempt() };
      const cancellation = await invoke(cancelled, `state=${cancelled.state}&error=access_denied`);
      assert.equal(new URL(cancellation.headers.get('location')!).searchParams.get('auth'), 'google-cancelled');
      assert.equal(new URL(cancellation.headers.get('location')!).searchParams.get('next'), '/pets/new');
      const successful = { ...oauth, id: await createAttempt() };
      token = sign();
      const response = await invoke(successful, `state=${successful.state}&code=test-code`);
      assert.equal(response.headers.get('location'), 'https://hugg.test/pets/new');
      assert.ok(response.cookies.get('token')?.value);
      const replay = await invoke(successful, `state=${successful.state}&code=test-code`);
      assert.equal(new URL(replay.headers.get('location')!).searchParams.get('auth'), 'google-error');
      assert.equal(replay.cookies.get('token'), undefined);
    } finally { OAuth2Client.prototype.getToken = originalGetToken; OAuth2Client.prototype.getFederatedSignonCertsAsync = originalCerts; }
  } finally { await prisma.$disconnect(); await rm(dir, { recursive: true, force: true }); }
});
