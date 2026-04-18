"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreatePetInput, type PetResponse } from "@hugg/schemas";
import { PetForm } from "@/components/pet-form";
import { updatePetAction } from "@/app/actions/pets";
import { useUnsavedChanges } from "@/components/unsaved-changes-context";
import { useUser } from "@/components/user-context";
import { UserDropdown } from "@/components/user-dropdown";
import { ArrowLeft } from "@phosphor-icons/react";

interface EditPetFormProps {
  pet: PetResponse;
}

export function EditPetForm({ pet }: EditPetFormProps) {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();
  const user = useUser();

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
    <main className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => requestNavigation(() => router.back())}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900 leading-tight">Editar pet</h1>
            <p className="text-xs text-gray-500">Atualize os dados de {pet.name}.</p>
          </div>
          {user && <UserDropdown user={user} />}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-28 sm:pb-8">
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
      </div>
    </main>
  );
}
