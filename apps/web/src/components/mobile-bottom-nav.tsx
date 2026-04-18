"use client";

import Link from "next/link";
import { Search, Heart, PawPrint } from "lucide-react";

interface MobileBottomNavProps {
  onSearchToggle: () => void;
  searchOpen: boolean;
}

export function MobileBottomNav({ onSearchToggle, searchOpen }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-center justify-around px-6 py-2 pb-safe">
        {/* Meus pets */}
        <Link
          href="/my-pets"
          className="flex flex-col items-center gap-1 py-1 px-3 text-gray-500 hover:text-orange-500 transition-colors"
        >
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium leading-none">Meus pets</span>
        </Link>

        {/* Achei um pet — botão principal */}
        <Link
          href="/pets/new"
          className="flex flex-col items-center justify-center w-14 h-14 -mt-5 rounded-full bg-orange-500 shadow-md hover:bg-orange-600 active:scale-95 transition-all text-white"
        >
          <PawPrint className="w-6 h-6" />
        </Link>

        {/* Busca */}
        <button
          onClick={onSearchToggle}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            searchOpen ? "text-orange-500" : "text-gray-500 hover:text-orange-500"
          }`}
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium leading-none">Buscar</span>
        </button>
      </div>
    </nav>
  );
}
