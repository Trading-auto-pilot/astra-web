export type CodeBlockProps = {
  code: string;
  className?: string;
};

/**
 * Simple, static code block replacement (react-live removed).
 */
export function CodeBlock({ code, className = "" }: CodeBlockProps) {
  return (
    <pre
      className={`
        my-2 overflow-auto rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-slate-100
        ${className}
      `}
    >
      <code>{code}</code>
    </pre>
  );
}

export default CodeBlock;
