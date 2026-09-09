"use client";

import { useAuthModal } from "./auth-modal-provider";
import Link from "next/link";
import type { SessionUser } from "@/lib/session";
import { loginHref } from "@/lib/auth-navigation";
import { UserDropdown } from "./user-dropdown";

export function AccountNav({ user, returnTo }: { user: SessionUser | null; returnTo: string }) {
  const auth = useAuthModal();
  return user ? <UserDropdown user={user} /> : (
    <Link onClick={event => { if (auth && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); auth.open({ intent: "sign-in", next: returnTo, view: "login" }); } }} href={loginHref(returnTo)} className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
      Entrar
    </Link>
  );
}
