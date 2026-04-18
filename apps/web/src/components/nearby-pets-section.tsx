"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import type { PetWithDistance } from "@hugg/schemas";
import { NearbyPetCard } from "@/components/nearby-pet-card";

interface NearbyPetsSectionProps {
  pets: PetWithDistance[];
  loading: boolean;
}

const SCROLL_AMOUNT = 500;

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
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, pets, loading]);

  const scrollLeft = () =>
    ref.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  const scrollRight = () =>
    ref.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });

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

      <div className="relative">
        {/* Chevron esquerdo */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Chevron direito */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Rolar para a direita"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : pets.map((pet) => <NearbyPetCard key={pet.id} pet={pet} />)}
        </div>
      </div>
    </section>
  );
}
