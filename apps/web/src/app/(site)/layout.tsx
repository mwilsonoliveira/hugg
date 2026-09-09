import { AuthModalProvider } from "@/components/auth-modal-provider";
import { googleEnabled, readAuthFlow } from "@/server/google-auth";
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

  const flow = readAuthFlow();
  const content = (
    <AuthModalProvider authenticated={!!user} googleEnabled={googleEnabled()} linkEmail={flow?.phase === "link" ? flow.email : undefined}>
    <UnsavedChangesProvider>
      {children}
      <MobileNavLayout />
    </UnsavedChangesProvider>
    </AuthModalProvider>
  );

  return user ? <UserProvider user={user}>{content}</UserProvider> : content;
}
