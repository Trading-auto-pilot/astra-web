export type CardHeaderActionProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardHeaderAction({ children, className = "" }: CardHeaderActionProps) {
  return <div className={`-mx-2 ${className}`}>{children}</div>;
}

export default CardHeaderAction;
