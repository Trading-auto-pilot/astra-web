import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
  primary: "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  danger: "bg-red-50 text-red-700 ring-1 ring-red-100",
};

export type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  rounded?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
  rounded = true,
  startIcon,
  endIcon,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
        ${toneClasses[tone]}
        ${rounded ? "rounded-full" : "rounded-md"}
        ${className}
      `}
    >
      {startIcon && <span className="inline-flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="inline-flex items-center">{endIcon}</span>}
    </span>
  );
}

export default Badge;
