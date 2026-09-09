import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/client";
import { resolveSeedConfig } from "../src/seed-config";

const { email, password, name, isLocal } = resolveSeedConfig(process.env);
const passwordHash = await bcrypt.hash(password, 10);

await prisma.user.upsert({
  where: { email },
  update: { name, passwordHash },
  create: { name, email, passwordHash },
});

console.log(`${isLocal ? "Usuário local preparado" : "Usuário remoto preparado"}: ${email}`);
if (isLocal) console.log(`Senha local: ${password}`);

await prisma.$disconnect();
