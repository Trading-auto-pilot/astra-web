import type { ReactNode } from "react";

export type ChipProps = {
  label: ReactNode;
  iconPosition?: "start" | "end";
  onClick?: () => void;
  className?: string;
};

export function Chip({ label, iconPosition = "start", onClick, className = "" }: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700
        ${onClick ? "cursor-pointer hover:bg-slate-100" : ""}
        ${className}
      `}
    >
      {iconPosition === "start" && typeof label !== "string" && label}
      {typeof label === "string" ? <span>{label}</span> : iconPosition === "end" ? label : null}
    </span>
  );
}

export default Chip;
