import { notFound } from "next/navigation";
import { getPet as getPetById } from "@/server/pets";
import { EditPetForm } from "@/components/edit-pet-form";
import { requirePageUser } from "@/lib/session";
import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function EditPetPage({ params }: Props) {
  const user = await requirePageUser(`/pets/${params.id}/edit`);

  let pet;
  try {
    pet = await getPetById(params.id);
  } catch {
    notFound();
  }

  if (pet.createdById !== user.id) redirect(`/pets/${pet.id}`);

  return <EditPetForm pet={pet} />;
}
