"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { PetResponse, PaginatedPets } from "@hugg/schemas";
import type { SessionUser } from "@/lib/session";
import { PetCard } from "@/components/pet-card";
import { PetCardSkeleton } from "@/components/pet-card-skeleton";
import { PetFilters } from "@/components/pet-filters";
import { UserDropdown } from "@/components/user-dropdown";
import { HuggLogo } from "@/components/hugg-logo";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { getPets, getNearbyPets, recordSearch } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useUserLocation } from "@/hooks/use-user-location";
import { NearbyPetsSection } from "@/components/nearby-pets-section";
import type { PetWithDistance } from "@hugg/schemas";
import { Heart, X, Search } from "lucide-react";

const PAGE_SIZE = 12;

interface HomePageContentProps {
  initialData: PaginatedPets;
  user: SessionUser;
}

export function HomePageContent({ initialData, user }: HomePageContentProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("linked") === "true") {
      toast.success("Conta vinculada ao Google com sucesso! Sua foto de perfil foi atualizada.");
    }
  }, [searchParams]);

  const [pets, setPets] = useState<PetResponse[]>(initialData.data);
  const [total, setTotal] = useState(initialData.total);
  const [search, setSearch] = useState("");
  const [waitingFilter, setWaitingFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nearbyPets, setNearbyPets] = useState<PetWithDistance[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const { location, status: locationStatus } = useUserLocation();
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

  useEffect(() => {
    if (locationStatus !== "granted" || !location) return;
    setNearbyLoading(true);
    getNearbyPets({ lat: location.lat, lng: location.lng })
      .then(setNearbyPets)
      .catch(() => {})
      .finally(() => setNearbyLoading(false));
  }, [location, locationStatus]);

  useEffect(() => {
    fetchPets(debouncedSearch, waitingFilter, 1);
    if (debouncedSearch.trim().length >= 2) {
      recordSearch(debouncedSearch);
    }
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

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen((prev) => {
      if (!prev) setTimeout(() => mobileSearchRef.current?.focus(), 50);
      return !prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          {/* Branding row */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div>
                <span className="flex gap-2 items-center text-xl font-bold text-gray-900">
                  hugg
                  <HuggLogo className="text-gray-900" />
                </span>
                <p className="text-xs text-gray-400 leading-none mt-0.5">
                  Conectando pets desabrigados a novos lares.
                </p>
              </div>
            </div>
            <UserDropdown user={user} />
          </div>

          {/* Filters row — desktop only */}
          <div className="hidden sm:block pb-3">
            <PetFilters
              search={search}
              onSearchChange={setSearch}
              waitingFilter={waitingFilter}
              onWaitingFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileSearchOpen(false)}
        >
          <div
            className="bg-white px-4 pt-4 pb-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <p className="text-sm font-semibold text-gray-700 flex-1">
                Buscar pet
              </p>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Buscar por nome ou raça..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Animais próximos */}
      {(nearbyLoading || nearbyPets.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <NearbyPetsSection pets={nearbyPets} loading={nearbyLoading} />
        </div>
      )}

      {/* Grid principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {nearbyPets.length > 0 && !loading && (
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-semibold text-gray-900 leading-none">
              Adote
            </h2>
          </div>
        )}
        {loading ? (
          <div className="w-full columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-3 space-y-3">
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
          <div className="w-full columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-3 space-y-3">
            {pets.map((pet) => (
              <div key={pet.id} className="break-inside-avoid">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}

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
      </div>

      <MobileBottomNav
        onSearchToggle={handleMobileSearchToggle}
        searchOpen={mobileSearchOpen}
      />
    </div>
  );
}
