import { useCallback, useEffect, useState } from "react";
import {
  cleanHash,
  getHashParts,
  getCurrentHash,
  getRouteId,
  getPermissionKey,
  getMicroserviceSlug,
  getTickerSymbol,
  getUserSettingsTab,
  navigate,
  matchRoute,
  type RouteId,
} from "../utils/routing";

export type HashRouterState = {
  /** Raw hash including # */
  hash: string;
  /** Cleaned path without # */
  path: string;
  /** Path split into parts */
  parts: string[];
  /** Normalized route ID */
  routeId: RouteId;
  /** Permission key for access control */
  permissionKey: string;
};

/**
 * React hook for hash-based routing.
 * Automatically updates when hash changes.
 */
export function useHashRouter() {
  const [hash, setHash] = useState<string>(() => getCurrentHash());

  useEffect(() => {
    const handleHashChange = () => {
      setHash(getCurrentHash());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const path = cleanHash(hash);
  const parts = getHashParts(hash);
  const routeId = getRouteId(hash);
  const permissionKey = getPermissionKey(hash);

  const goTo = useCallback((newPath: string) => {
    navigate(newPath);
  }, []);

  const matches = useCallback(
    (pattern: string) => matchRoute(hash, pattern),
    [hash]
  );

  return {
    hash,
    path,
    parts,
    routeId,
    permissionKey,
    navigate: goTo,
    matches,
  };
}

/**
 * Hook for microservice detail pages.
 * Returns the current microservice slug from URL.
 */
export function useMicroserviceSlug() {
  const { hash } = useHashRouter();
  return getMicroserviceSlug(hash);
}

/**
 * Hook for ticker detail pages.
 * Returns the current ticker symbol from URL.
 */
export function useTickerSymbol() {
  const { hash } = useHashRouter();
  return getTickerSymbol(hash);
}

/**
 * Hook for user settings pages.
 * Returns the current settings tab from URL.
 */
export function useUserSettingsTab() {
  const { hash } = useHashRouter();
  return getUserSettingsTab(hash);
}

export default useHashRouter;
