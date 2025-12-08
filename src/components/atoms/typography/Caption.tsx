import type { ElementType, ReactNode } from "react";

export type CaptionProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Caption({
  children,
  as: Component = "span",
  className = "",
}: CaptionProps) {
  return (
    <Component
      className={`text-xs text-slate-500 leading-snug tracking-tight ${className}`}
    >
      {children}
    </Component>
  );
}

export default Caption;
