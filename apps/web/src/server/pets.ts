import { normalizeSearchText, prisma, type Prisma } from "@hugg/database";
import {
  createPetSchema,
  listPetsQuerySchema,
  nearbyPetsQuerySchema,
  updatePetSchema,
  type CreatePetInput,
  type ListPetsQuery,
  type NearbyPetsQuery,
  type PetResponse,
  type UpdatePetInput,
} from "@hugg/schemas";
import { getDistanceKm } from "@hugg/utils";
import { AppError } from "./errors";

function petResponse(pet: {
  id: string; name: string | null; species: string; breed: string | null; age: number | null;
  description: string | null; imageUrls: Prisma.JsonValue; gender: string | null; status: string;
  situation: string; waitingSince: Date; latitude: number | null; longitude: number | null;
  locationNote: string | null; locationPhone: string | null; createdById: string; createdAt: Date; updatedAt: Date;
}): PetResponse {
  return {
    ...pet,
    name: pet.name ?? "Sem nome",
    imageUrls: Array.isArray(pet.imageUrls) ? pet.imageUrls.filter((url): url is string => typeof url === "string") : [],
    species: pet.species as PetResponse["species"],
    gender: pet.gender as PetResponse["gender"],
    status: pet.status as PetResponse["status"],
    situation: pet.situation as PetResponse["situation"],
  };
}

export async function listPets(input: Partial<ListPetsQuery> = {}) {
  const query = listPetsQuerySchema.parse(input);
  const now = new Date();
  let waitingSinceAfter: Date | undefined;
  let waitingSinceBefore: Date | undefined;
  if (query.waitingFilter === "90+") {
    waitingSinceBefore = new Date(now);
    waitingSinceBefore.setDate(now.getDate() - 90);
  } else if (query.waitingFilter) {
    waitingSinceAfter = new Date(now);
    waitingSinceAfter.setDate(now.getDate() - Number(query.waitingFilter));
  }
  const search = normalizeSearchText(query.search);
  const where: Prisma.PetWhereInput = {
    ...(search ? { OR: [{ nameNormalized: { contains: search } }, { breedNormalized: { contains: search } }] } : {}),
    ...(waitingSinceAfter ? { waitingSince: { gte: waitingSinceAfter } } : {}),
    ...(waitingSinceBefore ? { waitingSince: { lte: waitingSinceBefore } } : {}),
  };
  const [pets, total] = await Promise.all([
    prisma.pet.findMany({ where, orderBy: { waitingSince: "asc" }, skip: (query.page - 1) * query.limit, take: query.limit }),
    prisma.pet.count({ where }),
  ]);
  return { data: pets.map(petResponse), total, page: query.page, limit: query.limit };
}

export async function getPet(id: string) {
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) throw new AppError(404, "Pet não encontrado");
  return petResponse(pet);
}

export async function nearbyPets(input: NearbyPetsQuery) {
  const query = nearbyPetsQuerySchema.parse(input);
  const pets = await prisma.pet.findMany({ where: { latitude: { not: null }, longitude: { not: null } } });
  return pets.map((pet) => ({ ...petResponse(pet), distanceKm: getDistanceKm(query.lat, query.lng, pet.latitude!, pet.longitude!) }))
    .filter((pet) => pet.distanceKm <= query.radius).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, query.limit);
}

export async function createPet(input: CreatePetInput, userId: string) {
  const parsed = createPetSchema.safeParse(input);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());
  const pet = await prisma.pet.create({ data: {
    ...parsed.data,
    imageUrls: parsed.data.imageUrls,
    nameNormalized: normalizeSearchText(parsed.data.name),
    breedNormalized: normalizeSearchText(parsed.data.breed),
    createdById: userId,
  } });
  return petResponse(pet);
}

export async function updatePet(id: string, input: UpdatePetInput, userId: string) {
  const parsed = updatePetSchema.safeParse(input);
  if (!parsed.success) throw new AppError(400, "Dados inválidos", parsed.error.flatten());
  const existing = await prisma.pet.findUnique({ where: { id } });
  if (!existing) throw new AppError(404, "Pet não encontrado");
  if (existing.createdById !== userId) throw new AppError(403, "Somente quem cadastrou o pet pode editá-lo");
  const pet = await prisma.pet.update({ where: { id }, data: {
    ...parsed.data,
    ...(parsed.data.imageUrls ? { imageUrls: parsed.data.imageUrls } : {}),
    ...(Object.prototype.hasOwnProperty.call(parsed.data, "name") ? { nameNormalized: normalizeSearchText(parsed.data.name) } : {}),
    ...(Object.prototype.hasOwnProperty.call(parsed.data, "breed") ? { breedNormalized: normalizeSearchText(parsed.data.breed) } : {}),
  } });
  return petResponse(pet);
}
