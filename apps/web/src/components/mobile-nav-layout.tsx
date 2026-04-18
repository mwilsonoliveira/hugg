"use client";

import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function MobileNavLayout() {
  const pathname = usePathname();
  // Home manages its own nav (with search toggle); skip here to avoid duplicate
  if (pathname === "/") return null;
  return <MobileBottomNav onSearchToggle={() => {}} searchOpen={false} />;
}
