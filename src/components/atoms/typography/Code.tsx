import React from "react";

export type CodeProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  children: React.ReactNode;
};

/**
 * Inline code component styled similarly to the MUI version.
 */
export default function Code({ className = "", children, ...rest }: CodeProps) {
  return (
    <code
      className={`
        font-mono text-xs leading-none
        px-1 py-0.5
        rounded
        border border-zinc-300
        bg-zinc-100
        text-zinc-700
        align-middle
        ${className}
      `}
      {...rest}
    >
      {children}
    </code>
  );
}
