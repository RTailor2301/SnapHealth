import { useState, useEffect } from "react";

const STORAGE_KEY = "snaphealth_profile";

const DEFAULT_PROFILE = {
  age: "",
  biologicalSex: "",
  height: "",
  weight: "",
  knownConditions: [],
  currentMedications: [],
  allergies: [],
  familyHistory: [],
  notes: "",
};

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setProfile(saved ? JSON.parse(saved) : DEFAULT_PROFILE);
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
    setLoaded(true);
  }, []);

  function updateProfile(updates) {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      console.error("localStorage write failed");
    }
  }

  function clearProfile() {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
  }

  return { profile, updateProfile, clearProfile, loaded };
}
