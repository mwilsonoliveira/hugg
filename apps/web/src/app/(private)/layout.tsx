import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { MobileNavLayout } from "@/components/mobile-nav-layout";
import { UnsavedChangesProvider } from "@/components/unsaved-changes-context";
import { UserProvider } from "@/components/user-context";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <UserProvider user={user}>
      <UnsavedChangesProvider>
        {children}
        <MobileNavLayout />
      </UnsavedChangesProvider>
    </UserProvider>
  );
}
