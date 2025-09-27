import { useState, useEffect } from "react";

export interface UserLocation {
  address: string;
  lat: number;
  lng: number;
}

const STORAGE_KEY = "user-location";

export const useLocation = () => {
  const [location, setLocationState] = useState<UserLocation | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setLocation = (newLocation: UserLocation | null) => {
    setLocationState(newLocation);
    if (newLocation) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const clearLocation = () => {
    setLocation(null);
  };

  return {
    location,
    setLocation,
    clearLocation,
    hasLocation: !!location,
  };
};