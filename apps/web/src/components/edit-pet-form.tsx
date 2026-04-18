"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreatePetInput, type PetResponse } from "@hugg/schemas";
import { PetForm } from "@/components/pet-form";
import { updatePetAction } from "@/app/actions/pets";

interface EditPetFormProps {
  pet: PetResponse;
}

export function EditPetForm({ pet }: EditPetFormProps) {
  const router = useRouter();

  const onSubmit = async (data: CreatePetInput) => {
    try {
      await updatePetAction(pet.id, data);
      toast.success("Pet atualizado com sucesso!");
      router.push(`/pets/${pet.id}`);
    } catch {
      toast.error("Erro ao salvar alterações. Tente novamente.");
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Editar pet</h1>
          <p className="text-sm text-gray-500">Atualize os dados de {pet.name}.</p>
        </div>
      </div>

      <PetForm
        key={pet.id}
        defaultValues={{
          name: pet.name ?? undefined,
          species: pet.species,
          situation: pet.situation,
          gender: pet.gender ?? undefined,
          breed: pet.breed ?? undefined,
          age: pet.age ?? undefined,
          description: pet.description ?? undefined,
          imageUrls: pet.imageUrls,
          waitingSince: pet.waitingSince,
          latitude: pet.latitude ?? undefined,
          longitude: pet.longitude ?? undefined,
          locationNote: pet.locationNote ?? undefined,
          locationPhone: pet.locationPhone ?? undefined,
        }}
        onSubmit={onSubmit}
        submitLabel="Salvar alterações"
        submittingLabel="Salvando..."
      />
    </>
  );
}
