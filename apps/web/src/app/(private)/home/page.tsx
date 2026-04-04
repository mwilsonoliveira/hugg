import { getPets } from "@/lib/api";
import { PetList } from "@/components/pet-list";

export default async function Home() {
  const initialData = await getPets({ page: 1, limit: 12 });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">hugg</h1>
          <p className="text-sm text-gray-500 mt-1">
            Conectando pets desabrigados a novos lares.
          </p>
        </div>

        <PetList initialData={initialData} />
      </div>
    </main>
  );
}
