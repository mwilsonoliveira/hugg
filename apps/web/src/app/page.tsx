"use client";

import { useState, useMemo } from "react";
import { mockPets } from "@/lib/mock-pets";
import { PetCard } from "@/components/pet-card";
import { PetFilters } from "@/components/pet-filters";
import { waitingDays } from "@hugg/utils";

const PAGE_SIZE = 6;

export default function Home() {
  const [search, setSearch] = useState("");
  const [waitingFilter, setWaitingFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return mockPets
      .filter((pet) => {
        if (q) {
          const match =
            pet.name.toLowerCase().includes(q) ||
            (pet.breed?.toLowerCase().includes(q) ?? false);
          if (!match) return false;
        }

        if (waitingFilter) {
          const days = waitingDays(pet.waitingSince);
          if (waitingFilter === "7" && days > 7) return false;
          if (waitingFilter === "30" && days > 30) return false;
          if (waitingFilter === "90" && days > 90) return false;
          if (waitingFilter === "90+" && days <= 90) return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.waitingSince).getTime() -
          new Date(b.waitingSince).getTime()
      );
  }, [search, waitingFilter]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">hugg</h1>
          <p className="text-sm text-gray-500 mt-1">
            Conectando pets desabrigados a novos lares.
          </p>
        </div>

        {/* Barra de ações */}
        <div className="mb-6">
          <PetFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            waitingFilter={waitingFilter}
            onWaitingFilterChange={(v) => { setWaitingFilter(v); setPage(1); }}
          />
        </div>

        {/* Grid de cards */}
        {visible.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Nenhum pet encontrado.
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {visible.map((pet) => (
              <div key={pet.id} className="break-inside-avoid">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}

        {/* Carregar mais */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
