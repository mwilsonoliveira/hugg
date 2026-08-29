import { notFound } from "next/navigation";
import { getPet as getPetById } from "@/server/pets";
import { EditPetForm } from "@/components/edit-pet-form";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

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

  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (pet.createdById !== user.id) redirect(`/pets/${pet.id}`);

  return <EditPetForm pet={pet} />;
}
