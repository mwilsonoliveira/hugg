"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { useUser } from "@/components/user-context";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
  };
}

const menuItems = [
  { label: "Perfil", href: "/profile" },
  { label: "Meus pets", href: "/my-pets" },
  { label: "Configurações", href: "/settings" },
];

export function UserDropdown({ user }: UserDropdownProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ctx = useUser();

  useEffect(() => {
    if (!desktopOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [desktopOpen]);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    startTransition(() => { logoutAction(); });
  };

  const avatarCls =
    "w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm hover:bg-orange-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";

  return (
    <>
      {/* Desktop — dropdown customizado */}
      <div className="relative hidden sm:block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDesktopOpen((v) => !v)}
          className={avatarCls}
          aria-label="Menu do usuário"
        >
          {initials}
        </button>

        {desktopOpen && (
          <div className="absolute top-full right-0 mt-2 min-w-[180px] rounded-xl border border-gray-100 bg-white shadow-lg p-1 z-50">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDesktopOpen(false)}
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-1 h-px bg-gray-100" />

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        )}
      </div>

      {/* Mobile — trigger abre o painel gerenciado pelo UserProvider */}
      <button
        type="button"
        onClick={ctx?.openMobileMenu}
        className={`sm:hidden ${avatarCls}`}
        aria-label="Menu do usuário"
      >
        {initials}
      </button>
    </>
  );
}
