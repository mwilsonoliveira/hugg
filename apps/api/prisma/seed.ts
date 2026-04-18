import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@hugg.com";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Usuário de teste já existe:", email);
    return;
  }

  const passwordHash = await bcrypt.hash("hugg123456", 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin Hugg",
      email,
      passwordHash,
    },
  });

  console.log("Usuário de teste criado:");
  console.log("  E-mail:", user.email);
  console.log("  Senha: hugg123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
