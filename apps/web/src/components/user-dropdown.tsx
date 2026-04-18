"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

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
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm hover:bg-orange-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          aria-label="Menu do usuário"
        >
          {initials}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] rounded-xl border border-gray-100 bg-white shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
        >
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          {menuItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer outline-none focus:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

          <DropdownMenu.Item asChild>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 cursor-pointer outline-none focus:bg-red-50 transition-colors"
              >
                Sair
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
