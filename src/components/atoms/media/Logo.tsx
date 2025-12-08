import type { CSSProperties } from "react";

const logoSrc = new URL("../../../assets/logo/logo_vector.svg", import.meta.url).href;

export type LogoProps = {
  href?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Logo AstraAI basato sullo SVG fornito.
 */
export function Logo({ href = "/", className = "", style }: LogoProps) {
  const img = (
    <img
      src={logoSrc}
      alt="AstraAI"
      className={`h-8 w-auto ${className}`}
      style={style}
      loading="lazy"
    />
  );

  if (!href) return img;
  return (
    <a href={href} className="inline-flex items-center gap-2 no-underline hover:opacity-90">
      {img}
    </a>
  );
}

export default Logo;
