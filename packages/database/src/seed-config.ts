export const DEFAULT_SEED_EMAIL = "admin@hugg.com";
export const DEFAULT_SEED_PASSWORD = "hugg123456";

export function resolveSeedConfig(environment: NodeJS.ProcessEnv) {
  const databaseUrl = environment.TURSO_DATABASE_URL ?? "file:./prisma/dev.db";
  const isLocal = databaseUrl.startsWith("file:");

  if (!isLocal) {
    if (environment.ALLOW_REMOTE_SEED !== "true") {
      throw new Error("Seed remoto bloqueado. Defina ALLOW_REMOTE_SEED=true para autorizar.");
    }
    if (!environment.SEED_ADMIN_EMAIL || !environment.SEED_ADMIN_PASSWORD) {
      throw new Error("Seed remoto exige SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD explícitos.");
    }
  }

  return {
    email: environment.SEED_ADMIN_EMAIL ?? DEFAULT_SEED_EMAIL,
    password: environment.SEED_ADMIN_PASSWORD ?? DEFAULT_SEED_PASSWORD,
    name: environment.SEED_ADMIN_NAME ?? "Admin Hugg",
    isLocal,
  };
}
