import type { ReactNode } from "react";
import Logo from "../components/atoms/media/Logo";

export type EcommerceLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function EcommerceLayout({ children, footer }: EcommerceLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <a href="#" className="hover:text-slate-900">
            Shop
          </a>
          <a href="#" className="hover:text-slate-900">
            Categories
          </a>
          <a href="#" className="hover:text-slate-900">
            Account
          </a>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
      {footer && <div className="border-t border-slate-200 bg-white px-6 py-4">{footer}</div>}
    </div>
  );
}

export default EcommerceLayout;
