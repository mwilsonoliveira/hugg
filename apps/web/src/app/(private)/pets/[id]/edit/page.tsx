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

  return <EditPetForm pet={pet} />;
}
