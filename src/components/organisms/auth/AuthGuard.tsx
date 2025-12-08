import type { ReactNode } from "react";

export type AuthGuardProps = {
  isAuthenticated: boolean;
  children: ReactNode;
};

export function AuthGuard({
  isAuthenticated,
  children,
}: AuthGuardProps) {
  if (!isAuthenticated) {
    // Without router dependency, consumer handles redirect.
    return null;
  }
  return <>{children}</>;
}

export default AuthGuard;
