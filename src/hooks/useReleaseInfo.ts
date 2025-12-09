// src/hooks/useRelease.ts
import release from "../../public/release.json";

export function useRelease() {
  return release;   // version, note, date, etc.
}