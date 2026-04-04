"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPetSchema, type CreatePetInput } from "@hugg/schemas";
import { ImageDropzone } from "@/components/image-dropzone";
import { createPet } from "@/lib/api";

const SPECIES_OPTIONS = [
  { value: "DOG", label: "Cachorro" },
  { value: "CAT", label: "Gato" },
  { value: "BIRD", label: "Pássaro" },
  { value: "RABBIT", label: "Coelho" },
  { value: "OTHER", label: "Outro" },
];

const SITUATION_OPTIONS = [
  { value: "SHELTER", label: "Em abrigo" },
  { value: "ABANDONED", label: "Abandonado" },
  { value: "FOSTER", label: "Em lar temporário" },
  { value: "STREET", label: "Na rua" },
];

export default function NewPetPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
  });

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
        {/* Header */}
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Fotos */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Fotos <span className="text-red-500">*</span>
            </label>
            <Controller
              name="imageUrls"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <ImageDropzone
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.imageUrls?.message as string | undefined}
                />
              )}
            />
          </div>

          {/* Informações básicas */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700">Informações básicas</h2>

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="Ex: Bolinha"
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Espécie + Raça */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Espécie <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("species")}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Selecione</option>
                  {SPECIES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.species && <p className="text-xs text-red-500">{errors.species.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Raça</label>
                <input
                  {...register("breed")}
                  placeholder="Ex: Vira-lata"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Situação + Idade */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Situação <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("situation")}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="">Selecione</option>
                  {SITUATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {errors.situation && <p className="text-xs text-red-500">{errors.situation.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Idade (anos)</label>
                <input
                  {...register("age", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  placeholder="Ex: 2"
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                {errors.age && <p className="text-xs text-red-500">{errors.age.message}</p>}
              </div>
            </div>

            {/* Aguardando desde */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Aguardando desde <span className="text-red-500">*</span>
              </label>
              <input
                {...register("waitingSince")}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {errors.waitingSince && <p className="text-xs text-red-500">{errors.waitingSince.message}</p>}
            </div>

            {/* Descrição */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Conte um pouco sobre o animal..."
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isSubmitting ? "Cadastrando..." : "Cadastrar pet"}
          </button>
        </form>
      </div>
    </main>
  );
}
