import type { PaginatedPets, CreatePetInput, PetResponse } from "@hugg/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface GetPetsParams {
  search?: string;
  waitingFilter?: string;
  page?: number;
  limit?: number;
}

export async function getPets(params: GetPetsParams = {}): Promise<PaginatedPets> {
  const url = new URL("/api/pets", API_URL);

  if (params.search) url.searchParams.set("search", params.search);
  if (params.waitingFilter) url.searchParams.set("waitingFilter", params.waitingFilter);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Erro ao buscar pets: ${res.status}`);
  }

  return res.json();
}

export async function createPet(data: CreatePetInput): Promise<PetResponse> {
  const res = await fetch(`${API_URL}/api/pets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Erro ao criar pet: ${res.status}`);
  }

  return res.json();
}
