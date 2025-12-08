import React from "react";

export type ButtonVariant = "solid" | "outline" | "soft" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
export type ButtonShape = "default" | "circle" | "square";

export type BaseButtonProps = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

// ⬇⬇⬇ tutte classi TAILWIND STATICHE (niente bg-${...})
const VARIANT_COLOR_CLASSES: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary:   "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-600 text-white hover:bg-slate-700",
    success:   "bg-emerald-600 text-white hover:bg-emerald-700",
    warning:   "bg-amber-500 text-black hover:bg-amber-600",
    danger:    "bg-red-600 text-white hover:bg-red-700",
    neutral:   "bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
  },
  outline: {
    primary:   "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
    secondary: "border border-slate-600 text-slate-600 bg-transparent hover:bg-slate-50",
    success:   "border border-emerald-600 text-emerald-600 bg-transparent hover:bg-emerald-50",
    warning:   "border border-amber-500 text-amber-600 bg-transparent hover:bg-amber-50",
    danger:    "border border-red-600 text-red-600 bg-transparent hover:bg-red-50",
    neutral:   "border border-zinc-300 text-zinc-700 bg-transparent hover:bg-zinc-50",
  },
  soft: {
    primary:   "bg-blue-50 text-blue-700 hover:bg-blue-100",
    secondary: "bg-slate-50 text-slate-700 hover:bg-slate-100",
    success:   "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    warning:   "bg-amber-50 text-amber-700 hover:bg-amber-100",
    danger:    "bg-red-50 text-red-700 hover:bg-red-100",
    neutral:   "bg-zinc-50 text-zinc-800 hover:bg-zinc-100",
  },
  ghost: {
    primary:   "text-blue-600 hover:bg-blue-50",
    secondary: "text-slate-600 hover:bg-slate-50",
    success:   "text-emerald-600 hover:bg-emerald-50",
    warning:   "text-amber-600 hover:bg-amber-50",
    danger:    "text-red-600 hover:bg-red-50",
    neutral:   "text-zinc-700 hover:bg-zinc-100",
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

const shapeClasses: Record<ButtonShape, string> = {
  default: "rounded-md",
  circle: "rounded-full aspect-square p-0",
  square: "rounded-md",
};

export function BaseButton({
  children,
  variant = "solid",
  size = "md",
  color = "primary",
  shape = "default",
  loading = false,
  disabled,
  startIcon,
  endIcon,
  className = "",
  ...rest
}: BaseButtonProps) {
  const isDisabled = disabled || loading;
  const colorClasses = VARIANT_COLOR_CLASSES[variant][color];

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2
        font-medium
        transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        ${colorClasses}
        ${sizeClasses[size]}
        ${shapeClasses[shape]}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {startIcon && <span className="inline-flex items-center">{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className="inline-flex items-center">{endIcon}</span>}
    </button>
  );
}

export default BaseButton;
