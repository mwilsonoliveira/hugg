"use client";

import { useState, useEffect, useCallback } from "react";
import type { PetResponse, PaginatedPets } from "@hugg/schemas";
import { PetCard } from "@/components/pet-card";
import { PetCardSkeleton } from "@/components/pet-card-skeleton";
import { PetFilters } from "@/components/pet-filters";
import { getPets } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 6;

interface PetListProps {
  initialData: PaginatedPets;
}

export function PetList({ initialData }: PetListProps) {
  const [pets, setPets] = useState<PetResponse[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [search, setSearch] = useState("");
  const [waitingFilter, setWaitingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const fetchPets = useCallback(
    async (
      currentSearch: string,
      currentFilter: string,
      currentPage: number,
    ) => {
      setLoading(true);
      try {
        const [result] = await Promise.all([
          getPets({
            search: currentSearch || undefined,
            waitingFilter: currentFilter || undefined,
            page: currentPage,
            limit: PAGE_SIZE,
          }),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
        setPets(result.data);
        setTotal(result.total);
        setPage(currentPage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Dispara fetch quando o search debounced muda
  useEffect(() => {
    fetchPets(debouncedSearch, waitingFilter, 1);
  }, [debouncedSearch]);

  const handleFilterChange = (value: string) => {
    setWaitingFilter(value);
    fetchPets(debouncedSearch, value, 1);
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getPets({
        search: debouncedSearch || undefined,
        waitingFilter: waitingFilter || undefined,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setPets((prev) => [...prev, ...result.data]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = pets.length < total;

  return (
    <>
      {/* Barra de ações */}
      <div className="mb-6">
        <PetFilters
          search={search}
          onSearchChange={setSearch}
          waitingFilter={waitingFilter}
          onWaitingFilterChange={handleFilterChange}
        />
      </div>

      {/* Grid de cards */}
      {loading ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="break-inside-avoid">
              <PetCardSkeleton />
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Nenhum pet encontrado.
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {pets.map((pet) => (
            <div key={pet.id} className="break-inside-avoid">
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      )}

      {/* Carregar mais */}
      {!loading && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </>
  );
}
