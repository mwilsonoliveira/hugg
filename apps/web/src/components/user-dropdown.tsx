"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

const menuItems = [
  { label: "Perfil", href: "/profile" },
  { label: "Meus pets", href: "/my-pets" },
  { label: "Configurações", href: "/settings" },
];

export function UserDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm hover:bg-orange-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          aria-label="Menu do usuário"
        >
          U
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] rounded-xl border border-gray-100 bg-white shadow-lg p-1 animate-in fade-in-0 zoom-in-95"
        >
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
            <button
              onClick={() => {/* TODO: implement logout */}}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 cursor-pointer outline-none focus:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
