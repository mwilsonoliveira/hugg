"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Heart,
  MagnifyingGlass,
  Buildings,
  Plus,
} from "@phosphor-icons/react";

interface MobileBottomNavProps {
  onSearchToggle: () => void;
  searchOpen: boolean;
}

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
        active ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon size={22} weight={active ? "fill" : "regular"} />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </Link>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
        active ? "text-orange-500" : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon size={22} weight={active ? "fill" : "regular"} />
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  );
}

export function MobileBottomNav({ onSearchToggle, searchOpen }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-white border-t border-gray-100 shadow-lg">
      <div className="flex items-end justify-around px-6 pb-safe pt-2 pb-3">
        {/* Home */}
        <NavItem href="/" icon={House} label="Home" active={pathname === "/"} />

        {/* Meus pets */}
        <NavItem href="/my-pets" icon={Heart} label="Meus pets" active={pathname === "/my-pets"} />

        {/* Botão principal — Achei um pet */}
        <div className="flex flex-col items-center -mt-6">
          <Link
            href="/pets/new"
            className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center shadow-lg ring-4 ring-white"
          >
            <Plus size={28} weight="bold" color="white" />
          </Link>
        </div>

        {/* Buscar */}
        <NavButton icon={MagnifyingGlass} label="Buscar" active={searchOpen} onClick={onSearchToggle} />

        {/* Abrigos */}
        <NavItem href="/shelters" icon={Buildings} label="Abrigos" active={pathname === "/shelters"} />
      </div>
    </nav>
  );
}
