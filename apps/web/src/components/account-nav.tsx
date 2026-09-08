import Link from "next/link";
import type { SessionUser } from "@/lib/session";
import { loginHref } from "@/lib/auth-navigation";
import { UserDropdown } from "./user-dropdown";

export function AccountNav({ user, returnTo }: { user: SessionUser | null; returnTo: string }) {
  return user ? <UserDropdown user={user} /> : (
    <Link href={loginHref(returnTo)} className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
      Entrar
    </Link>
  );
}
