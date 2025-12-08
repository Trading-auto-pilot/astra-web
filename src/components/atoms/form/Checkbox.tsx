import type { InputHTMLAttributes } from "react";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
  description?: string;
  error?: string;
};

export function Checkbox({
  id,
  label,
  description,
  error,
  className = "",
  ...rest
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        {...rest}
      />
      <div className="space-y-1">
        {label && <span className="text-sm font-medium text-slate-800">{label}</span>}
        {description && <p className="text-xs text-slate-500 leading-snug">{description}</p>}
        {error && <p className="text-xs text-red-600 leading-snug">{error}</p>}
      </div>
    </label>
  );
}

export default Checkbox;
