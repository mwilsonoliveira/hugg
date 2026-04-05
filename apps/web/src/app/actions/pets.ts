"use server";

import { revalidatePath } from "next/cache";
import { updatePet } from "@/lib/api";
import type { UpdatePetInput, PetResponse } from "@hugg/schemas";

export async function updatePetAction(id: string, data: UpdatePetInput): Promise<PetResponse> {
  const result = await updatePet(id, data);
  revalidatePath(`/pets/${id}`);
  revalidatePath(`/pets/${id}/edit`);
  return result;
}
