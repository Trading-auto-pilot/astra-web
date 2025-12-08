import type { ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";

export type EmailLayoutProps = {
  children: ReactNode;
  sidebar?: ReactNode;
};

export function EmailLayout({ children, sidebar }: EmailLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-72 border-r border-slate-200 bg-white p-4 md:block">
        <Logo />
        <div className="mt-6">{sidebar}</div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default EmailLayout;
