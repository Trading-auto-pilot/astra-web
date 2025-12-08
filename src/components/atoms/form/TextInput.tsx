import type { InputHTMLAttributes, ReactNode } from "react";

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  hint?: string;
  error?: string;
  addonLeft?: ReactNode;
  addonRight?: ReactNode;
};

export function TextInput({
  id,
  label,
  hint,
  error,
  addonLeft,
  addonRight,
  className = "",
  ...rest
}: TextInputProps) {
  const inputClasses = `
    w-full rounded-md border
    ${error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"}
    bg-white text-slate-900
    shadow-sm
    focus:border-transparent focus:outline-none focus:ring-2
    placeholder:text-slate-400
    disabled:bg-slate-100 disabled:text-slate-500
    ${addonLeft ? "ps-10" : "ps-3"}
    ${addonRight ? "pe-10" : "pe-3"}
    py-2 text-sm
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {addonLeft && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center ps-3 text-slate-400">
            {addonLeft}
          </span>
        )}

        <input id={id} className={inputClasses} {...rest} />

        {addonRight && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pe-3 text-slate-400">
            {addonRight}
          </span>
        )}
      </div>

      {(hint || error) && (
        <p className={`text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default TextInput;
