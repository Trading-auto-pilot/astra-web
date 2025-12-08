import Badge from "../../atoms/form/Badge";

export type OutlinedBadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
  className?: string;
};

/**
 * Simple outlined badge variant using the Badge atom.
 */
export function OutlinedBadge({ children, tone = "neutral", className = "" }: OutlinedBadgeProps) {
  return (
    <Badge
      tone={tone}
      className={`border border-current bg-transparent text-current ${className}`}
      rounded
    >
      {children}
    </Badge>
  );
}

export default OutlinedBadge;
