import type { ReactNode } from "react";

export type LiveProviderProps = {
  children: ReactNode;
  code?: string;
  disabled?: boolean;
};

/**
 * Minimal placeholder for react-live's LiveProvider.
 * Simply renders children; no live editing/runtime transpilation.
 */
export function LiveProvider({ children }: LiveProviderProps) {
  return <>{children}</>;
}

export default LiveProvider;
