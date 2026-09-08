import { getCurrentUser } from "@/lib/session";
import { MobileNavLayout } from "@/components/mobile-nav-layout";
import { UnsavedChangesProvider } from "@/components/unsaved-changes-context";
import { UserProvider } from "@/components/user-context";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const content = (
    <UnsavedChangesProvider>
      {children}
      <MobileNavLayout />
    </UnsavedChangesProvider>
  );

  return user ? <UserProvider user={user}>{content}</UserProvider> : content;
}
