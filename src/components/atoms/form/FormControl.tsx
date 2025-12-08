export type FormControlProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormControl({ label, children, className = "" }: FormControlProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <div className="text-sm font-medium text-slate-700">{label}</div>}
      {children}
    </div>
  );
}

export default FormControl;
