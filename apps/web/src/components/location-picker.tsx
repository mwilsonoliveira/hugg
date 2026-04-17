"use client";

import { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { Situation } from "@hugg/types";

interface LocationPickerProps {
  situation: Situation | "";
  latitude?: number;
  longitude?: number;
  locationNote?: string;
  onLocationChange: (lat: number, lng: number) => void;
  onLocationNoteChange: (note: string) => void;
  onClear: () => void;
}

const BRAZIL_CENTER = { lat: -14.235, lng: -51.925 };

function noteLabel(situation: Situation | ""): string {
  if (situation === "SHELTER") return "Nome do abrigo";
  if (situation === "FOSTER") return "Contato da pessoa responsável";
  if (situation === "STREET" || situation === "ABANDONED") return "Descrição do local";
  return "Informações do local";
}

function notePlaceholder(situation: Situation | ""): string {
  if (situation === "SHELTER") return "Ex: Abrigo Amigo dos Animais, Rua das Flores, 123";
  if (situation === "FOSTER") return "Ex: João Silva – (11) 99999-0000";
  if (situation === "STREET" || situation === "ABANDONED") return "Ex: Próximo ao Parque da Aclimação, SP";
  return "Descreva onde o animal está";
}

function MapPicker({
  latitude,
  longitude,
  onLocationChange,
}: {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const hasPin = latitude != null && longitude != null;
  const center = hasPin
    ? { lat: latitude, lng: longitude }
    : BRAZIL_CENTER;
  const zoom = hasPin ? 15 : 4;

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
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="hugg-location-picker"
        onClick={handleMapClick}
        gestureHandling="greedy"
        disableDefaultUI
        zoomControl
      >
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
  situation,
  latitude,
  longitude,
  locationNote,
  onLocationChange,
  onLocationNoteChange,
  onClear,
}: LocationPickerProps) {
  const [open, setOpen] = useState(
    !!(latitude != null || longitude != null || locationNote)
  );
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

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
        onLocationChange(pos.coords.latitude, pos.coords.longitude);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Permissão de localização negada. Permita o acesso no navegador.");
        } else {
          setGeoError("Não foi possível obter a localização.");
        }
      }
    );
  };

  const handleClear = () => {
    onClear();
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          Sei onde está! Adicionar localização
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4">
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

      {/* Campo de texto contextual */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          {noteLabel(situation)}
        </label>
        <input
          type="text"
          value={locationNote ?? ""}
          onChange={(e) => onLocationNoteChange(e.target.value)}
          placeholder={notePlaceholder(situation)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
      </div>

      {/* Botão GPS */}
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={geoLoading}
          className="flex items-center gap-2 self-start text-sm text-gray-600 hover:text-orange-500 border border-gray-200 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
        >
          {geoLoading ? (
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2.5a.75.75 0 01.75.75v3h3a.75.75 0 010 1.5h-3v3a.75.75 0 01-1.5 0v-3h-3a.75.75 0 010-1.5h3v-3A.75.75 0 0110 4.5z" clipRule="evenodd" />
            </svg>
          )}
          {geoLoading ? "Obtendo localização..." : "Usar minha localização"}
        </button>
        {geoError && (
          <p className="text-xs text-red-500">{geoError}</p>
        )}
        {latitude != null && longitude != null && (
          <p className="text-xs text-gray-400">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        )}
      </div>

      {/* Mapa */}
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <MapPicker
            latitude={latitude}
            longitude={longitude}
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
  );
}
