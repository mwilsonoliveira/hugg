"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import Link from "next/link";
import { X } from "@phosphor-icons/react";
import { logoutAction } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/session";

interface UserContextValue {
  user: SessionUser;
  openMobileMenu: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function useUser() {
  return useContext(UserContext);
}

const menuItems = [
  { label: "Perfil", href: "/profile" },
  { label: "Meus pets", href: "/my-pets" },
  { label: "Configurações", href: "/settings" },
];

export function UserProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initials = user.name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <UserContext.Provider
      value={{ user, openMobileMenu: () => setMobileOpen(true) }}
    >
      {children}

      {/* Painel mobile — renderizado no nível do layout, fora de qualquer stacking context */}
      {mobileOpen && (
        <div
          className="fixed inset-0 flex flex-col bg-white"
          style={{ zIndex: 99999 }}
        >
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ zIndex: 999999 }}
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-start flex-1 gap-6 px-8 -mt-12">
            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
              {initials}
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>

            <div className="w-full flex flex-col items-center divide-y divide-gray-100 border-y border-gray-100">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-4 text-base text-gray-700 hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="text-base text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saindo..." : "Sair"}
            </button>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
}
