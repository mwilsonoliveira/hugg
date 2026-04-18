"use client";

import { useState, useEffect } from "react";

interface UserLocation {
  lat: number;
  lng: number;
}

type LocationStatus = "idle" | "loading" | "granted" | "denied";

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { timeout: 10_000, maximumAge: 5 * 60 * 1_000 }
    );
  }, []);

  return { location, status };
}
