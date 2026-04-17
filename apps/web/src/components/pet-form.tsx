"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPetSchema,
  type CreatePetInput,
  type Species,
  SRD_LABEL,
} from "@hugg/schemas";
import type { Situation } from "@hugg/types";
import { ImageDropzone } from "@/components/image-dropzone";
import { BreedCombobox } from "@/components/breed-combobox";
import { LocationPicker } from "@/components/location-picker";

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

interface PetFormProps {
  defaultValues?: Partial<CreatePetInput>;
  onSubmit: (data: CreatePetInput) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

export function PetForm({
  defaultValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: PetFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
    defaultValues,
  });

  const selectedSpecies = useWatch({ control, name: "species" }) as Species | "";
  const selectedBreed = useWatch({ control, name: "breed" }) as string | undefined;
  const selectedSituation = useWatch({ control, name: "situation" }) as string | "";
  const mixedBreed = selectedBreed === SRD_LABEL;

  // Limpa a raça apenas quando a espécie realmente muda (não no mount inicial)
  const prevSpeciesRef = useRef<string | undefined>(defaultValues?.species);
  useEffect(() => {
    if (selectedSpecies === prevSpeciesRef.current) return;
    prevSpeciesRef.current = selectedSpecies;
    setValue("breed", undefined, { shouldDirty: true, shouldValidate: true });
  }, [selectedSpecies, setValue]);

  const handleMixedBreedChange = (checked: boolean) => {
    setValue("breed", checked ? SRD_LABEL : undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const toDateInputValue = (val: Date | string | undefined) => {
    if (!val) return "";
    return new Date(val).toISOString().split("T")[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Fotos */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Fotos <span className="text-red-500">*</span>
        </label>
        <Controller
          name="imageUrls"
          control={control}
          defaultValue={defaultValues?.imageUrls ?? []}
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
        <h2 className="text-sm font-semibold text-gray-700">
          Informações básicas
        </h2>

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
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
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
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.species && (
              <p className="text-xs text-red-500">{errors.species.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Controller
              name="breed"
              control={control}
              render={({ field }) => (
                <BreedCombobox
                  species={selectedSpecies}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  error={errors.breed?.message}
                />
              )}
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mixedBreed}
                onChange={(e) => handleMixedBreedChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 accent-orange-500"
              />
              <span className="text-xs text-gray-500">Sem raça definida</span>
            </label>
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
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.situation && (
              <p className="text-xs text-red-500">{errors.situation.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Idade (anos)
            </label>
            <input
              {...register("age", { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="Ex: 2"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            {errors.age && (
              <p className="text-xs text-red-500">{errors.age.message}</p>
            )}
          </div>
        </div>

        {/* Aguardando desde */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Aguardando desde <span className="text-red-500">*</span>
          </label>
          <Controller
            name="waitingSince"
            control={control}
            render={({ field }) => (
              <input
                type="date"
                value={field.value ? toDateInputValue(field.value) : ""}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value + "T00:00:00") : null)}
                onBlur={field.onBlur}
                max={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            )}
          />
          {errors.waitingSince && (
            <p className="text-xs text-red-500">Informe uma data</p>
          )}
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
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Localização */}
      <Controller
        name="latitude"
        control={control}
        render={({ field: latField }) => (
          <Controller
            name="longitude"
            control={control}
            render={({ field: lngField }) => (
              <Controller
                name="locationNote"
                control={control}
                render={({ field: noteField }) => (
                  <LocationPicker
                    situation={selectedSituation as "" | Situation}
                    latitude={latField.value as number | undefined}
                    longitude={lngField.value as number | undefined}
                    locationNote={noteField.value as string | undefined}
                    onLocationChange={(lat, lng) => {
                      latField.onChange(lat);
                      lngField.onChange(lng);
                    }}
                    onLocationNoteChange={noteField.onChange}
                    onClear={() => {
                      latField.onChange(undefined);
                      lngField.onChange(undefined);
                      noteField.onChange(undefined);
                    }}
                  />
                )}
              />
            )}
          />
        )}
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}
