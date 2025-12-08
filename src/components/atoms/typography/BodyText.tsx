import type { ElementType, ReactNode } from "react";

export type BodyTextProps = {
  children: ReactNode;
  as?: ElementType;
  muted?: boolean;
  className?: string;
};

export function BodyText({
  children,
  as: Component = "p",
  muted = false,
  className = "",
}: BodyTextProps) {
  return (
    <Component
      className={`text-sm leading-relaxed ${
        muted ? "text-slate-500" : "text-slate-700"
      } ${className}`}
    >
      {children}
    </Component>
  );
}

export default BodyText;
