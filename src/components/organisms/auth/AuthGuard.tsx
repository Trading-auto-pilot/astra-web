import type { ReactNode } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export type AuthGuardProps = {
  children: ReactNode;
  /** @deprecated Use useAuth() instead - this prop is ignored */
  isAuthenticated?: boolean;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    // Without router dependency, consumer handles redirect.
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;
