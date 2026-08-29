import "dotenv/config";
import { createClient, type InStatement } from "@libsql/client";
import { put } from "@vercel/blob";
import { Pool } from "pg";
import { normalizeSearchText } from "../src/normalize";

const sourceUrl = process.env.RAILWAY_DATABASE_URL;
const targetUrl = process.env.TURSO_DATABASE_URL;
if (!sourceUrl || !targetUrl) throw new Error("Defina RAILWAY_DATABASE_URL e TURSO_DATABASE_URL");
if (!process.env.TURSO_AUTH_TOKEN) throw new Error("Defina TURSO_AUTH_TOKEN");

const source = new Pool({ connectionString: sourceUrl, max: 2 });
const target = createClient({ url: targetUrl, authToken: process.env.TURSO_AUTH_TOKEN });

for (const table of ["User", "Pet", "SearchHistory", "Adoption"] as const) {
  const result = await target.execute(`SELECT COUNT(*) AS count FROM "${table}"`);
  if (Number(result.rows[0]?.count ?? 0) !== 0) {
    throw new Error(`O Turso de destino não está vazio (${table}). Migração abortada.`);
  }
}

function value(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return value as string | number | null;
}

async function migrateImage(image: unknown, petId: string, index: number) {
  if (typeof image !== "string" || !image.startsWith("data:")) return image;
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN é obrigatório para migrar imagens Base64");
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/s.exec(image);
  if (!match) throw new Error(`Imagem Base64 inválida no pet ${petId}`);
  const extension = match[1] === "image/jpeg" ? "jpg" : match[1].split("/")[1];
  const blob = await put(`pets/migrated/${petId}-${index}.${extension}`, Buffer.from(match[2], "base64"), {
    access: "public",
    contentType: match[1],
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

async function insertMany(statements: InStatement[]) {
  for (let offset = 0; offset < statements.length; offset += 50) {
    await target.batch(statements.slice(offset, offset + 50), "write");
  }
}

const users = (await source.query('SELECT * FROM "User" ORDER BY "createdAt"')).rows;
await insertMany(users.map((row) => ({
  sql: 'INSERT INTO "User" ("id","name","email","passwordHash","phone","avatarUrl","createdAt","updatedAt") VALUES (?,?,?,?,?,?,?,?)',
  args: [row.id, row.name, row.email, row.passwordHash, row.phone, row.avatarUrl, value(row.createdAt), value(row.updatedAt)],
})));
console.log(`Users: ${users.length}`);

const pets = (await source.query('SELECT * FROM "Pet" ORDER BY "createdAt"')).rows;
const petStatements: InStatement[] = [];
for (const row of pets) {
  const originalImages = Array.isArray(row.imageUrls) ? row.imageUrls : [];
  const images = await Promise.all(originalImages.map((image: unknown, index: number) => migrateImage(image, row.id, index)));
  petStatements.push({
    sql: `INSERT INTO "Pet" ("id","name","nameNormalized","species","breed","breedNormalized","age","description","imageUrls","gender","status","situation","waitingSince","latitude","longitude","locationNote","locationPhone","createdAt","updatedAt","createdById") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [row.id, row.name, normalizeSearchText(row.name), row.species, row.breed, normalizeSearchText(row.breed), row.age, row.description, JSON.stringify(images), row.gender, row.status, row.situation, value(row.waitingSince), row.latitude, row.longitude, row.locationNote, row.locationPhone, value(row.createdAt), value(row.updatedAt), row.createdById],
  });
}
await insertMany(petStatements);
console.log(`Pets: ${pets.length}`);

const searches = (await source.query('SELECT * FROM "SearchHistory" ORDER BY "lastUsed"')).rows;
await insertMany(searches.map((row) => ({
  sql: 'INSERT INTO "SearchHistory" ("id","query","count","lastUsed") VALUES (?,?,?,?)',
  args: [row.id, row.query, row.count, value(row.lastUsed)],
})));
console.log(`SearchHistory: ${searches.length}`);

const adoptions = (await source.query('SELECT * FROM "Adoption" ORDER BY "createdAt"')).rows;
await insertMany(adoptions.map((row) => ({
  sql: 'INSERT INTO "Adoption" ("id","status","message","createdAt","updatedAt","petId","userId") VALUES (?,?,?,?,?,?,?)',
  args: [row.id, row.status, row.message, value(row.createdAt), value(row.updatedAt), row.petId, row.userId],
})));
console.log(`Adoptions: ${adoptions.length}`);

for (const [table, expected] of [["User", users.length], ["Pet", pets.length], ["SearchHistory", searches.length], ["Adoption", adoptions.length]] as const) {
  const result = await target.execute(`SELECT COUNT(*) AS count FROM "${table}"`);
  const actual = Number(result.rows[0]?.count ?? -1);
  if (actual !== expected) throw new Error(`Contagem divergente em ${table}: origem=${expected}, destino=${actual}`);
}

console.log("Migração e verificação concluídas.");
await source.end();
target.close();
