export type MapLoadStatus = "loading" | "ready" | "error";
export type MapLoadEvent = "loaded" | "failed" | "retry";

export function reduceMapLoadStatus(
  _status: MapLoadStatus,
  event: MapLoadEvent
): MapLoadStatus {
  if (event === "loaded") return "ready";
  if (event === "failed") return "error";
  return "loading";
}

export function getGeolocationErrorMessage(code: number): string {
  if (code === 1) {
    return "Permissão negada. Permita o acesso à localização no navegador.";
  }
  if (code === 2) {
    return "Sua localização não está disponível no momento. Tente novamente.";
  }
  if (code === 3) {
    return "A localização demorou demais para responder. Tente novamente.";
  }
  return "Não foi possível obter a localização. Tente novamente.";
}
