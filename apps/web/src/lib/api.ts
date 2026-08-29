import type { PaginatedPets, CreatePetInput, UpdatePetInput, PetResponse, PetWithDistance } from "@hugg/schemas";

export interface GetPetsParams {
  search?: string;
  waitingFilter?: string;
  page?: number;
  limit?: number;
}

export async function getPets(params: GetPetsParams = {}): Promise<PaginatedPets> {
  const url = new URLSearchParams();

  if (params.search) url.set("search", params.search);
  if (params.waitingFilter) url.set("waitingFilter", params.waitingFilter);
  if (params.page) url.set("page", String(params.page));
  if (params.limit) url.set("limit", String(params.limit));

  const res = await fetch(`/api/pets?${url}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Erro ao buscar pets: ${res.status}`);
  }

  return res.json();
}

export async function getPetById(id: string): Promise<PetResponse> {
  const res = await fetch(`/api/pets/${id}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Erro ao buscar pet: ${res.status}`);
  }

  return res.json();
}

export async function updatePet(id: string, data: UpdatePetInput): Promise<PetResponse> {
  const res = await fetch(`/api/pets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar pet: ${res.status}`);
  }

  return res.json();
}

export async function getNearbyPets(params: {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}): Promise<PetWithDistance[]> {
  const url = new URLSearchParams({ lat: String(params.lat), lng: String(params.lng) });
  if (params.radius) url.set("radius", String(params.radius));
  if (params.limit) url.set("limit", String(params.limit));

  const res = await fetch(`/api/pets/nearby?${url}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getSearchHistory(): Promise<{ query: string; count: number }[]> {
  const res = await fetch("/api/searches", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.searches;
}

export async function recordSearch(query: string): Promise<void> {
  if (!query || query.trim().length < 2) return;
  await fetch("/api/searches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim().toLowerCase() }),
  }).catch(() => {/* fire-and-forget */});
}

export async function createPet(data: CreatePetInput): Promise<PetResponse> {
  const res = await fetch("/api/pets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Erro ao criar pet: ${res.status}`);
  }

  return res.json();
}
