import type { ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";

export type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerContent?: ReactNode;
};

export function AuthLayout({
  children,
  title = "Benvenuto",
  subtitle,
  headerContent,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
        {headerContent ?? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <span className="text-xs font-semibold text-blue-600">Auth</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
              {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
            </div>
          </>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
