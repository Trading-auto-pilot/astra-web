import type { ReactNode } from "react";

export type SimpleBarProps = {
  children: ReactNode;
  disableHorizontal?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Lightweight scroll container replacement for simplebar-react.
 */
export function SimpleBar({
  children,
  disableHorizontal = false,
  className = "",
  style,
}: SimpleBarProps) {
  return (
    <div
      className={`
        h-full overflow-y-auto
        ${disableHorizontal ? "overflow-x-hidden" : "overflow-x-auto"}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

export default SimpleBar;
