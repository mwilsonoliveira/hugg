export function normalizeSearchText(value: string | null | undefined) {
  if (!value) return null;

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}
