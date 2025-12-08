export type SpinnerProps = {
  size?: number;
  thickness?: number;
  className?: string;
};

export function Spinner({ size = 32, thickness = 3, className = "" }: SpinnerProps) {
  const border = `${thickness}px`;
  return (
    <span
      className={`inline-block animate-spin rounded-full border-solid border-current border-t-transparent ${className}`}
      style={{
        width: size,
        height: size,
        borderWidth: border,
      }}
      aria-label="loading"
    />
  );
}

export default Spinner;
