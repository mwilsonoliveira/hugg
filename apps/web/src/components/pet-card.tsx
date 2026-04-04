"use client";

import { useState } from "react";
import Link from "next/link";
import type { PetResponse } from "@hugg/schemas";
import { waitingLabel, speciesLabel } from "@hugg/utils";

interface PetCardProps {
  pet: PetResponse;
}

export function PetCard({ pet }: PetCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  const hasMultiple = pet.imageUrls.length > 1;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Fotos */}
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${photoIndex * 100}%)` }}
          >
            {pet.imageUrls.length > 0 ? (
              pet.imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={pet.name}
                  className="w-full object-cover shrink-0"
                  style={{ minWidth: "100%" }}
                />
              ))
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0" style={{ minWidth: "100%" }}>
                Sem foto
              </div>
            )}
          </div>
        </div>

        {/* Dots de navegação */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {pet.imageUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === photoIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Botão de like */}
        <button
          onClick={() => setLiked((v) => !v)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-transform active:scale-90"
          aria-label={liked ? "Remover dos favoritos" : "Favoritar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            className={`w-4 h-4 transition-colors ${liked ? "text-red-500" : "text-gray-500"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Setas laterais */}
        {hasMultiple && photoIndex > 0 && (
          <button
            onClick={() => setPhotoIndex((i) => i - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {hasMultiple && photoIndex < pet.imageUrls.length - 1 && (
          <button
            onClick={() => setPhotoIndex((i) => i + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-700">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Informações */}
      <Link href={`/pets/${pet.id}`} className="p-3 flex flex-col gap-1 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">{pet.name}</span>
          <span className="text-xs text-gray-400">{speciesLabel(pet.species)}</span>
        </div>
        <span className="text-xs text-gray-500">{waitingLabel(pet.waitingSince, pet.situation)}</span>
      </Link>
    </div>
  );
}
