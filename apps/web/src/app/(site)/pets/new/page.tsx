import { NewPetForm } from "@/components/new-pet-form";
import { requirePageUser } from "@/lib/session";

export default async function NewPetPage() {
  await requirePageUser("/pets/new");
  return <NewPetForm />;
}
