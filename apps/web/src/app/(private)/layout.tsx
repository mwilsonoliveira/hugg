import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { MobileNavLayout } from "@/components/mobile-nav-layout";

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
    <>
      {children}
      <MobileNavLayout />
    </>
  );
}
