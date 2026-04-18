"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreatePetInput } from "@hugg/schemas";
import { PetForm } from "@/components/pet-form";
import { createPet } from "@/lib/api";
import { ArrowLeft } from "@phosphor-icons/react";
import { useUnsavedChanges } from "@/components/unsaved-changes-context";

export default function NewPetPage() {
  const router = useRouter();
  const { requestNavigation } = useUnsavedChanges();

  const onSubmit = async (data: CreatePetInput) => {
    try {
      await createPet(data);
      toast.success("Pet cadastrado com sucesso!");
      router.push("/");
    } catch {
      toast.error("Erro ao cadastrar pet. Tente novamente.");
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
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Achei um pet!</h1>
            <p className="text-xs text-gray-500">Preencha os dados do animal encontrado.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-28 sm:pb-8">
        <PetForm
          onSubmit={onSubmit}
          submitLabel="Cadastrar pet"
          submittingLabel="Cadastrando..."
        />
      </div>
    </main>
  );
}
