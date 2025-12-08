import type { ReactNode } from "react";
import VibrantBackground from "../components/molecules/layout/VibrantBackground";

export type LandingLayoutProps = {
  children: ReactNode;
  navItems?: { label: string; href: string }[];
  backgroundImage?: string;
};

export function LandingLayout({
  children,
  navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ],
  backgroundImage = "/background/landing/space.jpeg",
}: LandingLayoutProps) {
  // Keep default navItems for future use while avoiding unused variable warnings.
  void navItems;
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div
        className="absolute inset-x-0 top-0 h-1/2 w-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundPosition: "center top",
        }}
      />
      {!backgroundImage && <VibrantBackground variant="top" className="-z-10" />}

      <main className="relative w-full pb-16">{children}</main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-4 text-sm text-slate-600">
          <span>© {new Date().getFullYear()} AstraAI</span>
          <div className="flex gap-3">
            <a href="#privacy" className="hover:text-slate-900">
              Privacy
            </a>
            <a href="#terms" className="hover:text-slate-900">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingLayout;
