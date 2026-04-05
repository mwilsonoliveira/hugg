/**
 * Lê o banco local atual e gera o arquivo seed.ts com os dados reais.
 * Uso: npx tsx prisma/generate-seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { writeFileSync } from "fs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const pets = await prisma.pet.findMany({ orderBy: { createdAt: "asc" } });
  const searches = await prisma.searchHistory.findMany({ orderBy: { count: "desc" } });

  const lines: string[] = [];

  lines.push(`import { PrismaClient } from "@prisma/client";`);
  lines.push(`import { PrismaPg } from "@prisma/adapter-pg";`);
  lines.push(`import "dotenv/config";`);
  lines.push(``);
  lines.push(`const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });`);
  lines.push(`const prisma = new PrismaClient({ adapter });`);
  lines.push(``);
  lines.push(`async function main() {`);

  // Users
  lines.push(`  // Usuários`);
  const userVarNames: Record<string, string> = {};
  for (const user of users) {
    const varName = user.name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "");
    userVarNames[user.id] = varName;
    lines.push(`  const ${varName} = await prisma.user.upsert({`);
    lines.push(`    where: { email: ${JSON.stringify(user.email)} },`);
    lines.push(`    update: {},`);
    lines.push(`    create: {`);
    lines.push(`      id: ${JSON.stringify(user.id)},`);
    lines.push(`      name: ${JSON.stringify(user.name)},`);
    lines.push(`      email: ${JSON.stringify(user.email)},`);
    if (user.phone) lines.push(`      phone: ${JSON.stringify(user.phone)},`);
    if (user.avatarUrl) lines.push(`      avatarUrl: ${JSON.stringify(user.avatarUrl)},`);
    lines.push(`    },`);
    lines.push(`  });`);
    lines.push(``);
  }

  // Pets
  lines.push(`  // Pets`);
  lines.push(`  await prisma.pet.createMany({`);
  lines.push(`    skipDuplicates: true,`);
  lines.push(`    data: [`);
  for (const pet of pets) {
    lines.push(`      {`);
    lines.push(`        id: ${JSON.stringify(pet.id)},`);
    lines.push(`        name: ${JSON.stringify(pet.name)},`);
    lines.push(`        species: "${pet.species}",`);
    if (pet.breed) lines.push(`        breed: ${JSON.stringify(pet.breed)},`);
    if (pet.age !== null) lines.push(`        age: ${pet.age},`);
    if (pet.description) lines.push(`        description: ${JSON.stringify(pet.description)},`);
    lines.push(`        imageUrls: ${JSON.stringify(pet.imageUrls)},`);
    lines.push(`        status: "${pet.status}",`);
    lines.push(`        situation: "${pet.situation}",`);
    lines.push(`        waitingSince: new Date(${JSON.stringify(pet.waitingSince.toISOString())}),`);
    if (pet.latitude !== null) lines.push(`        latitude: ${pet.latitude},`);
    if (pet.longitude !== null) lines.push(`        longitude: ${pet.longitude},`);
    lines.push(`        createdById: ${JSON.stringify(pet.createdById)},`);
    lines.push(`      },`);
  }
  lines.push(`    ],`);
  lines.push(`  });`);
  lines.push(``);

  // Search history
  lines.push(`  // Histórico de pesquisas`);
  lines.push(`  for (const item of ${JSON.stringify(searches.map(s => ({ query: s.query, count: s.count })), null, 4)}) {`);
  lines.push(`    await prisma.searchHistory.upsert({`);
  lines.push(`      where: { query: item.query },`);
  lines.push(`      update: {},`);
  lines.push(`      create: { query: item.query, count: item.count },`);
  lines.push(`    });`);
  lines.push(`  }`);
  lines.push(``);
  lines.push(`  console.log("✅ Seed concluído.");`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`main()`);
  lines.push(`  .catch((e) => { console.error(e); process.exit(1); })`);
  lines.push(`  .finally(() => prisma.$disconnect());`);
  lines.push(``);

  writeFileSync("prisma/seed.ts", lines.join("\n"), "utf-8");
  console.log("✅ prisma/seed.ts gerado com sucesso.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
