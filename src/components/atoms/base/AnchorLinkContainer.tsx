// src/components/atoms/navigation/AnchorLinkContainer.tsx
import type { ReactNode } from "react";

export type AnchorLinkContainerProps = {
  /** ID usato per creare automaticamente #anchor */
  hashHref: string;
  /** Contenuto interno (titolo, testo, icona, ecc.) */
  children: ReactNode;
  /** Dimensione del pulsante link */
  size?: "sm" | "md" | "lg";
  /** Classi aggiuntive personalizzabili */
  className?: string;
};

export function AnchorLinkContainer({
  children,
  hashHref,
  size = "md",
  className = "",
}: AnchorLinkContainerProps) {
  const sizeClasses =
    size === "sm"
      ? "w-6 h-6 text-xs"
      : size === "lg"
      ? "w-10 h-10 text-xl"
      : "w-8 h-8 text-sm";

  const scrollToAnchor = () => {
    const el = document.getElementById(hashHref);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.location.hash = `#${hashHref}`;
  };

  return (
    <div
      className={`
        relative flex items-center gap-2 group
        ${className}
      `}
    >
      {children}

      {/* Pulsante "link" visibile solo su hover */}
      <button
        type="button"
        onClick={scrollToAnchor}
        className={`
          absolute right-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          inline-flex items-center justify-center
          bg-primary/10 text-primary rounded
          hover:bg-primary hover:text-white
          ${sizeClasses}
        `}
        title="Copy link to this section"
      >
        {/* Icona semplice evitando dipendenze */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l1.83-1.83a5 5 0 0 0-7.07-7.07l-1.76 1.76" />
          <path d="M14 11a5 5 0 0 0-7.54-.54L4.63 12.29a5 5 0 1 0 7.07 7.07l1.76-1.76" />
        </svg>
      </button>
    </div>
  );
}

export default AnchorLinkContainer;
