"use server";

import { revalidatePath } from "next/cache";
import { updatePet } from "@/server/pets";
import { getCurrentUser } from "@/lib/session";
import { AppError } from "@/server/errors";
import type { UpdatePetInput, PetResponse } from "@hugg/schemas";

export async function updatePetAction(id: string, data: UpdatePetInput): Promise<PetResponse> {
  const user = await getCurrentUser();
  if (!user) throw new AppError(401, "Não autenticado");
  const result = await updatePet(id, data, user.id);
  revalidatePath(`/pets/${id}`);
  revalidatePath(`/pets/${id}/edit`);
  return result;
}
