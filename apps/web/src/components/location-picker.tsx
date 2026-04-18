"use client";

import { useState, useCallback, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { MapPinned, Loader2 } from "lucide-react";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  locationNote?: string;
  locationPhone?: string;
  onLocationChange: (lat: number, lng: number) => void;
  onLocationNoteChange: (note: string) => void;
  onLocationPhoneChange: (phone: string) => void;
  onClear: () => void;
}

const BRAZIL_CENTER = { lat: -14.235, lng: -51.925 };

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface PanRequest {
  pos: google.maps.LatLngLiteral;
  id: number;
}

function MapController({ panRequest }: { panRequest: PanRequest | null }) {
  const map = useMap();

  useEffect(() => {
    if (map && panRequest) {
      map.panTo(panRequest.pos);
      map.setZoom(17);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, panRequest?.id]);

  return null;
}

function MapPicker({
  latitude,
  longitude,
  panRequest,
  onLocationChange,
}: {
  latitude?: number;
  longitude?: number;
  panRequest: PanRequest | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const hasPin = latitude != null && longitude != null;
  const defaultCenter = hasPin ? { lat: latitude, lng: longitude } : BRAZIL_CENTER;
  const defaultZoom = hasPin ? 15 : 4;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail.latLng) {
        onLocationChange(e.detail.latLng.lat, e.detail.latLng.lng);
      }
    },
    [onLocationChange]
  );

  return (
    <div className="w-full h-52 rounded-xl overflow-hidden border border-gray-200">
      <Map
        mapId={mapId}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        onClick={handleMapClick}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
      >
        <MapController panRequest={panRequest} />
        {hasPin && (
          <AdvancedMarker
            position={{ lat: latitude, lng: longitude }}
            draggable
            onDragEnd={(e) => {
              if (e.latLng) {
                onLocationChange(e.latLng.lat(), e.latLng.lng());
              }
            }}
          />
        )}
      </Map>
    </div>
  );
}

export function LocationPicker({
  latitude,
  longitude,
  locationNote,
  locationPhone,
  onLocationChange,
  onLocationNoteChange,
  onLocationPhoneChange,
  onClear,
}: LocationPickerProps) {
  const [open, setOpen] = useState(
    !!(latitude != null || longitude != null || locationNote || locationPhone)
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [panRequest, setPanRequest] = useState<PanRequest | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada pelo navegador.");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        onLocationChange(lat, lng);
        setPanRequest({ pos: { lat, lng }, id: Date.now() });
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Permissão negada. Permita o acesso à localização no navegador.");
        } else {
          setGeoError("Não foi possível obter a localização.");
        }
      }
    );
  };

  const handleClear = () => {
    onClear();
    setPanRequest(null);
    setOpen(false);
    setGeoError(null);
  };

  if (!open) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          <MapPinned className="w-4 h-4" />
          Sei onde está! Adicionar localização
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Localização</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Remover localização
        </button>
      </div>

      {/* Mapa */}
      <div className="flex flex-col gap-2">
        {/* Título do mapa + botão GPS na mesma linha */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-700">
            Indique no mapa onde o animal está
          </p>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={geoLoading}
            className="flex items-center gap-1.5 shrink-0 text-xs text-gray-600 hover:text-orange-500 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50"
          >
            {geoLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPinned className="w-3.5 h-3.5" />
            )}
            {geoLoading ? "Obtendo..." : "Usar minha localização"}
          </button>
        </div>

        {geoError && <p className="text-xs text-red-500">{geoError}</p>}

        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <MapPicker
              latitude={latitude}
              longitude={longitude}
              panRequest={panRequest}
              onLocationChange={onLocationChange}
            />
          </APIProvider>
        ) : (
          <div className="w-full h-52 rounded-xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
            <p className="text-xs text-gray-400 text-center px-4">
              Configure <code className="font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> para exibir o mapa
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400">
          Clique no mapa ou arraste o marcador para ajustar a posição.
        </p>
      </div>

      {/* Contato — abaixo do mapa */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Nome do contato</label>
          <input
            type="text"
            value={locationNote ?? ""}
            onChange={(e) => onLocationNoteChange(e.target.value)}
            placeholder="Ex: João Silva"
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            inputMode="numeric"
            value={locationPhone ?? ""}
            onChange={(e) => onLocationPhoneChange(applyPhoneMask(e.target.value))}
            placeholder="(51) 99999-9999"
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
