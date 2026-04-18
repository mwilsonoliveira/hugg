"use client";

import { MapPin } from "lucide-react";
import type { PetWithDistance } from "@hugg/schemas";
import { NearbyPetCard } from "@/components/nearby-pet-card";

interface NearbyPetsSectionProps {
  pets: PetWithDistance[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="w-44 shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-2.5 flex flex-col gap-1.5">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export function NearbyPetsSection({ pets, loading }: NearbyPetsSectionProps) {
  if (!loading && pets.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-orange-500" />
        <div>
          <h2 className="text-sm font-semibold text-gray-900 leading-none">
            Animais próximos a você
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Com base na sua localização</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : pets.map((pet) => <NearbyPetCard key={pet.id} pet={pet} />)}
      </div>
    </section>
  );
}
