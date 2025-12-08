import type { ElementType, ReactNode } from "react";

export type SubtitleProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Subtitle({
  children,
  as: Component = "h2",
  className = "",
}: SubtitleProps) {
  return (
    <Component
      className={`text-lg font-semibold text-slate-800 leading-snug ${className}`}
    >
      {children}
    </Component>
  );
}

export default Subtitle;
