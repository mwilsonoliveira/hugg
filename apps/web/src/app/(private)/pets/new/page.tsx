"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreatePetInput } from "@hugg/schemas";
import { PetForm } from "@/components/pet-form";
import { createPet } from "@/lib/api";

export default function NewPetPage() {
  const router = useRouter();

  const onSubmit = async (data: CreatePetInput) => {
    try {
      await createPet(data);
      toast.success("Pet cadastrado com sucesso!");
      router.push("/home");
    } catch {
      toast.error("Erro ao cadastrar pet. Tente novamente.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
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
            <h1 className="text-xl font-bold text-gray-900">Achei um pet!</h1>
            <p className="text-sm text-gray-500">Preencha os dados do animal encontrado.</p>
          </div>
        </div>

        <PetForm
          onSubmit={onSubmit}
          submitLabel="Cadastrar pet"
          submittingLabel="Cadastrando..."
        />
      </div>
    </main>
  );
}
