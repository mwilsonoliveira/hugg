import assert from 'node:assert/strict';
import test from 'node:test';
import { sealFlow, openFlow, validGoogleClaims } from './auth-flow';

const context = { phase: 'oauth' as const, id: 'attempt', state: 'state', nonce: 'nonce', verifier: 'verifier', next: '/pets/new', source: '/', intent: 'create' as const };
test('contexto criptografado: leitura, adulteração, chave e expiração', () => {
  const sealed = sealFlow(context, 'test-secret', 1000);
  assert.ok(!sealed.includes('verifier'));
  assert.deepEqual(openFlow(sealed, 'test-secret', 1001), { ...context, expiresAt: 601000 });
  assert.equal(openFlow(sealed, 'other-secret', 1001), null);
  assert.equal(openFlow(sealed, 'test-secret', 601001), null);
  const parts = sealed.split('.');
  parts[1] = (parts[1]![0] === 'A' ? 'B' : 'A') + parts[1]!.slice(1);
  assert.equal(openFlow(parts.join('.'), 'test-secret', 1001), null);
  assert.equal(openFlow('malformed', 'test-secret'), null);
});
test('claims Google exigem nonce, subject e e-mail verificado', () => {
  const claims = { sub: 'google-id', email: 'User@Example.com', email_verified: true, nonce: 'nonce', name: 'User' };
  assert.equal(validGoogleClaims(claims, 'nonce').email, 'user@example.com');
  for (const override of [{ nonce: 'other' }, { email_verified: false }, { sub: '' }, { email: 'invalid' }]) {
    assert.throws(() => validGoogleClaims({ ...claims, ...override }, 'nonce'));
  }
});
