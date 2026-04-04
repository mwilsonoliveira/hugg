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

  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

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
        situation: "SHELTER",
        waitingSince: daysAgo(120),
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
        situation: "FOSTER",
        waitingSince: daysAgo(45),
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
        situation: "SHELTER",
        waitingSince: daysAgo(200),
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
        situation: "ABANDONED",
        waitingSince: daysAgo(10),
        latitude: -23.555,
        longitude: -46.641,
        createdById: joao.id,
      },
      {
        name: "Mel",
        species: "DOG",
        breed: "Poodle",
        age: 5,
        description: "Muito carinhosa, ideal para apartamento.",
        status: "AVAILABLE",
        situation: "FOSTER",
        waitingSince: daysAgo(60),
        latitude: -23.562,
        longitude: -46.654,
        createdById: joao.id,
      },
      {
        name: "Pipoca",
        species: "RABBIT",
        age: 1,
        description: "Coelho tranquilo, se dá bem com crianças.",
        status: "AVAILABLE",
        situation: "ABANDONED",
        waitingSince: daysAgo(30),
        latitude: -23.549,
        longitude: -46.645,
        createdById: ana.id,
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
