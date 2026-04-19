import { getPets } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";
import { HomePageContent } from "@/components/home-page-content";
import { redirect } from "next/navigation";

const EMPTY_PETS = { pets: [], total: 0, page: 1, totalPages: 0 };

export default async function Home() {
  const [initialData, user] = await Promise.all([
    getPets({ page: 1, limit: 12 }).catch(() => EMPTY_PETS),
    getCurrentUser(),
  ]);

  if (!user) redirect("/login");

  return <HomePageContent initialData={initialData} user={user} />;
}
