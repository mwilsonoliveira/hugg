"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { PetWithDistance } from "@hugg/schemas";
import { waitingLabel } from "@hugg/utils";
import { ShareButton } from "@/components/share-button";

interface NearbyPetCardProps {
  pet: PetWithDistance;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function NearbyPetCard({ pet }: NearbyPetCardProps) {
  const [liked, setLiked] = useState(false);
  const stopProp = (e: React.MouseEvent) => e.preventDefault();

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow w-44 shrink-0 snap-start"
    >
      {/* Foto */}
      <div className="relative h-44 overflow-hidden">
        {pet.imageUrls[0] ? (
          <img
            src={pet.imageUrls[0]}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            Sem foto
          </div>
        )}

        {/* Badge de distância */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
          <MapPin className="w-3 h-3 text-orange-500" />
          <span className="text-xs font-semibold text-gray-700">
            {formatDistance(pet.distanceKm)}
          </span>
        </div>

        {/* Botão like */}
        <button
          onClick={(e) => { stopProp(e); setLiked((v) => !v); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform active:scale-90"
          aria-label={liked ? "Remover dos favoritos" : "Favoritar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            className={`w-3.5 h-3.5 transition-colors ${liked ? "text-red-500" : "text-gray-500"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-0.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-900 truncate">{pet.name}</span>
          <div onClick={stopProp} className="shrink-0">
            <ShareButton petId={pet.id} petName={pet.name} situation={pet.situation} size="sm" />
          </div>
        </div>
        <span className="text-xs text-gray-500 truncate">{waitingLabel(pet.waitingSince, pet.situation)}</span>
      </div>
    </Link>
  );
}
