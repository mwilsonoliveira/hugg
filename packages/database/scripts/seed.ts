import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/client";

const email = process.env.SEED_ADMIN_EMAIL ?? "admin@hugg.com";
const password = process.env.SEED_ADMIN_PASSWORD ?? "hugg123456";

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log(`Usuário de teste já existe: ${email}`);
} else {
  await prisma.user.create({
    data: {
      name: "Admin Hugg",
      email,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  console.log(`Usuário de teste criado: ${email}`);
}

await prisma.$disconnect();
