export function formatPetAge(age?: number): string {
  if (age === undefined || age === null) return "Idade desconhecida";
  if (age === 0) return "Filhote";
  if (age === 1) return "1 ano";
  return `${age} anos`;
}

export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function speciesLabel(species: string): string {
  const labels: Record<string, string> = {
    DOG: "Cachorro",
    CAT: "Gato",
    BIRD: "Pássaro",
    RABBIT: "Coelho",
    OTHER: "Outro",
  };
  return labels[species] ?? species;
}

export function situationLabel(situation: string): string {
  const labels: Record<string, string> = {
    SHELTER: "Em abrigo",
    ABANDONED: "Abandonado",
    FOSTER: "Em lar temporário",
    STREET: "Na rua",
  };
  return labels[situation] ?? situation;
}

export function waitingDays(since: Date): number {
  const ms = Date.now() - new Date(since).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function waitingLabel(since: Date, situation: string): string {
  const days = waitingDays(since);
  const sit = situationLabel(situation);
  if (days === 0) return `${sit} · hoje`;
  if (days === 1) return `${sit} · 1 dia`;
  return `${sit} · ${days} dias`;
}
