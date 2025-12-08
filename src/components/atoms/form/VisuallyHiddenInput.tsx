import type { InputHTMLAttributes } from "react";

export type VisuallyHiddenInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Hidden input for accessibility (e.g., styled file inputs).
 */
export function VisuallyHiddenInput(props: VisuallyHiddenInputProps) {
  return (
    <input
      {...props}
      className="absolute bottom-0 left-0 h-px w-px clip rect-0 overflow-hidden whitespace-nowrap opacity-0"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export default VisuallyHiddenInput;
