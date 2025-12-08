import React from "react";

export type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type SelectInputProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
};

export function SelectInput({
  id,
  label,
  hint,
  error,
  options,
  className = "",
  ...rest
}: SelectInputProps) {
  const selectClasses = `
    w-full rounded-md border bg-white text-slate-900 shadow-sm
    ${error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"}
    focus:border-transparent focus:outline-none focus:ring-2
    py-2 px-3 text-sm
    disabled:bg-slate-100 disabled:text-slate-500
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <select id={id} className={selectClasses} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>

      {(hint || error) && (
        <p className={`text-xs ${error ? "text-red-600" : "text-slate-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default SelectInput;
