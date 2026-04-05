import { notFound } from "next/navigation";
import { getPetById } from "@/lib/api";
import { EditPetForm } from "@/components/edit-pet-form";

interface Props {
  params: { id: string };
}

export default async function EditPetPage({ params }: Props) {
  let pet;
  try {
    pet = await getPetById(params.id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <EditPetForm pet={pet} />
      </div>
    </main>
  );
}
