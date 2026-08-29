import "dotenv/config";
import { createClient } from "@libsql/client";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const databaseUrl = process.env.TURSO_DATABASE_URL ?? "file:./prisma/dev.db";
const client = createClient({
  url: databaseUrl,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const migrationsDirectory = fileURLToPath(new URL("../prisma/migrations", import.meta.url));

await client.execute(`
  CREATE TABLE IF NOT EXISTS "_hugg_migrations" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const result = await client.execute('SELECT "name" FROM "_hugg_migrations"');
const applied = new Set(result.rows.map((row) => String(row.name)));
const migrationNames = (await readdir(migrationsDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of migrationNames) {
  if (applied.has(name)) continue;

  const sql = await readFile(path.join(migrationsDirectory, name, "migration.sql"), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean)
    .map((statement) => ({ sql: statement }));

  await client.migrate([
    ...statements,
    { sql: 'INSERT INTO "_hugg_migrations" ("name") VALUES (?)', args: [name] },
  ]);
  console.log(`Applied migration: ${name}`);
}

client.close();
