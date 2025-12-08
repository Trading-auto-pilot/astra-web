import type { ElementType, ReactNode } from "react";

export type TitleProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export function Title({ children, as: Component = "h1", className = "" }: TitleProps) {
  return (
    <Component
      className={`text-2xl font-semibold tracking-tight text-slate-900 ${className}`}
    >
      {children}
    </Component>
  );
}

export default Title;
