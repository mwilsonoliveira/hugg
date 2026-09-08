import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SEED_EMAIL, DEFAULT_SEED_PASSWORD, resolveSeedConfig } from "./seed-config";

test("usa credenciais previsíveis somente para SQLite local", () => {
  assert.deepEqual(resolveSeedConfig({ TURSO_DATABASE_URL: "file:./dev.db" }), {
    email: DEFAULT_SEED_EMAIL,
    password: DEFAULT_SEED_PASSWORD,
    name: "Admin Hugg",
    isLocal: true,
  });
});

test("bloqueia seed remoto sem autorização explícita", () => {
  assert.throws(() => resolveSeedConfig({ TURSO_DATABASE_URL: "libsql://production.turso.io" }), /bloqueado/);
  assert.throws(
    () => resolveSeedConfig({ TURSO_DATABASE_URL: "libsql://production.turso.io", ALLOW_REMOTE_SEED: "true" }),
    /exige SEED_ADMIN_EMAIL/,
  );
});

test("aceita seed remoto somente com autorização e credenciais explícitas", () => {
  const config = resolveSeedConfig({
    TURSO_DATABASE_URL: "libsql://preview.turso.io",
    ALLOW_REMOTE_SEED: "true",
    SEED_ADMIN_EMAIL: "preview@example.com",
    SEED_ADMIN_PASSWORD: "strong-preview-password",
  });
  assert.equal(config.email, "preview@example.com");
  assert.equal(config.isLocal, false);
});
