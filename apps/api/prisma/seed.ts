import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Usuários
  const ana = await prisma.user.upsert({
    where: { email: "ana@hugg.dev" },
    update: {},
    create: {
      name: "Ana Silva",
      email: "ana@hugg.dev",
      phone: "11999990001",
    },
  });

  const joao = await prisma.user.upsert({
    where: { email: "joao@hugg.dev" },
    update: {},
    create: {
      name: "João Souza",
      email: "joao@hugg.dev",
      phone: "11999990002",
    },
  });

  // Pets
  await prisma.pet.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Bolt",
        species: "DOG",
        breed: "Vira-lata",
        age: 2,
        description: "Cachorro dócil e brincalhão, ótimo com crianças.",
        status: "AVAILABLE",
        latitude: -23.5505,
        longitude: -46.6333,
        createdById: ana.id,
      },
      {
        name: "Mimi",
        species: "CAT",
        breed: "Siamês",
        age: 1,
        description: "Gatinha curiosa e carinhosa.",
        status: "AVAILABLE",
        latitude: -23.561,
        longitude: -46.656,
        createdById: ana.id,
      },
      {
        name: "Thor",
        species: "DOG",
        breed: "Labrador",
        age: 3,
        description: "Cão grande e tranquilo, gosta de passeios.",
        status: "UNDER_REVIEW",
        latitude: -23.548,
        longitude: -46.638,
        createdById: joao.id,
      },
      {
        name: "Nina",
        species: "CAT",
        age: 0,
        description: "Filhote resgatada da rua, muito saudável.",
        status: "AVAILABLE",
        latitude: -23.555,
        longitude: -46.641,
        createdById: joao.id,
      },
    ],
  });

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
