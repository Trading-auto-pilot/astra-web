import type { ReactNode } from "react";

export type FormLabelProps = {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
};

export function FormLabel({
  htmlFor,
  children,
  className = "",
  required = false,
}: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-slate-700 ${className}`}
    >
      {children}
      {required && <span className="text-red-600 ms-0.5">*</span>}
    </label>
  );
}

export default FormLabel;
