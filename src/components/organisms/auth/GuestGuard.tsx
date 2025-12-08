import type { ReactNode } from "react";

export type GuestGuardProps = {
  isAuthenticated: boolean;
  children: ReactNode;
};

export function GuestGuard({
  isAuthenticated,
  children,
}: GuestGuardProps) {
  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}

export default GuestGuard;
