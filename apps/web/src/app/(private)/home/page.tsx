import { getPets } from "@/lib/api";
import { HomePageContent } from "@/components/home-page-content";

export default async function Home() {
  const initialData = await getPets({ page: 1, limit: 12 });

  return <HomePageContent initialData={initialData} />;
}
