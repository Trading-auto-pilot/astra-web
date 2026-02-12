import type { ReactNode } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export type GuestGuardProps = {
  children: ReactNode;
  /** @deprecated Use useAuth() instead - this prop is ignored */
  isAuthenticated?: boolean;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default GuestGuard;
