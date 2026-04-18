import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPetById } from "@/lib/api";
import { PetPhotoCarousel } from "@/components/pet-photo-carousel";
import { speciesLabel, situationLabel, waitingDuration } from "@hugg/utils";
import { ShareButton } from "@/components/share-button";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const pet = await getPetById(params.id);
    const description = pet.description
      ? `${pet.description.slice(0, 120)}...`
      : `${pet.name} está aguardando um lar. Conheça no hugg e ajude a encontrar uma família.`;

    return {
      title: `${pet.name} · hugg`,
      description,
      openGraph: {
        title: `${pet.name} está procurando um lar`,
        description,
        images: pet.imageUrls[0] ? [{ url: pet.imageUrls[0] }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${pet.name} está procurando um lar`,
        description,
        images: pet.imageUrls[0] ? [pet.imageUrls[0]] : [],
      },
    };
  } catch {
    return { title: "Pet · hugg" };
  }
}

export default async function PetDetailPage({ params }: Props) {
  let pet;
  try {
    pet = await getPetById(params.id);
  } catch {
    notFound();
  }

  const duration = waitingDuration(pet.waitingSince);

  const INFO_ROWS = [
    { label: "Espécie", value: speciesLabel(pet.species) },
    { label: "Raça", value: pet.breed ?? "Não informada" },
    {
      label: "Idade",
      value:
        pet.age != null
          ? `${pet.age} ${pet.age === 1 ? "ano" : "anos"}`
          : "Não informada",
    },
    { label: "Situação", value: situationLabel(pet.situation) },
    { label: "Aguardando há", value: duration },
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
            href="/"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          <div className="flex items-center gap-2">
            <ShareButton
              petId={pet.id}
              petName={pet.name}
              situation={pet.situation}
              size="md"
            />
            <Link
              href={`/pets/${pet.id}/edit`}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
              Editar
            </Link>
          </div>
        </div>

        {/* Carrossel de fotos */}
        <div className="rounded-2xl overflow-hidden mb-6 bg-white border border-gray-100 shadow-sm">
          <PetPhotoCarousel imageUrls={pet.imageUrls} name={pet.name} />
        </div>

        {/* Nome e situação */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {situationLabel(pet.situation)} · há {duration}
          </p>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">Informações</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {INFO_ROWS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        {pet.description && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {pet.description}
            </p>
          </div>
        )}

        {/* Localização */}
        {(pet.locationNote ||
          pet.locationPhone ||
          (pet.latitude != null && pet.longitude != null)) && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-gray-700">Localização</h2>
            {pet.locationNote && (
              <p className="text-sm text-gray-600">{pet.locationNote}</p>
            )}
            {pet.locationPhone && (
              <p className="text-sm text-gray-600">{pet.locationPhone}</p>
            )}
            {pet.latitude != null && pet.longitude != null && (
              <>
                <iframe
                  title="Localização no mapa"
                  className="w-full h-52 rounded-xl border border-gray-200"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${pet.latitude},${pet.longitude}&z=15&output=embed`}
                />
                <a
                  href={`https://maps.google.com/?q=${pet.latitude},${pet.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 self-start text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ver no Google Maps
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
