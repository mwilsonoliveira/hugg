import { notFound } from "next/navigation";
import Link from "next/link";
import { getPetById } from "@/lib/api";
import { PetPhotoCarousel } from "@/components/pet-photo-carousel";
import { speciesLabel, situationLabel, waitingDays } from "@hugg/utils";

interface Props {
  params: { id: string };
}

export default async function PetDetailPage({ params }: Props) {
  let pet;
  try {
    pet = await getPetById(params.id);
  } catch {
    notFound();
  }

  const days = waitingDays(pet.waitingSince);

  const INFO_ROWS = [
    { label: "Espécie", value: speciesLabel(pet.species) },
    { label: "Raça", value: pet.breed ?? "Não informada" },
    { label: "Idade", value: pet.age != null ? `${pet.age} ${pet.age === 1 ? "ano" : "anos"}` : "Não informada" },
    { label: "Situação", value: situationLabel(pet.situation) },
    {
      label: "Aguardando há",
      value: days === 0 ? "Hoje" : days === 1 ? "1 dia" : `${days} dias`,
    },
    {
      label: "Desde",
      value: new Date(pet.waitingSince).toLocaleDateString("pt-BR"),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/home"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-600">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </Link>

          <Link
            href={`/pets/${pet.id}/edit`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Editar
          </Link>
        </div>

        {/* Carrossel de fotos */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-white border border-gray-100 shadow-sm">
          <PetPhotoCarousel imageUrls={pet.imageUrls} name={pet.name} />
        </div>

        {/* Nome e situação */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {situationLabel(pet.situation)} · {days === 0 ? "desde hoje" : `há ${days} ${days === 1 ? "dia" : "dias"}`}
          </p>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Informações</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {INFO_ROWS.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        {pet.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Descrição</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{pet.description}</p>
          </div>
        )}
      </div>
    </main>
  );
}
