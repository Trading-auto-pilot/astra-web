import AppIcon from "../../atoms/icon/AppIcon";

export type SnackbarIconProps = {
  icon: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

const toneClasses: Record<NonNullable<SnackbarIconProps["tone"]>, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
};

export function SnackbarIcon({ icon, tone = "default" }: SnackbarIconProps) {
  return (
    <span
      className={`notistack-Icon inline-flex h-10 w-10 items-center justify-center rounded-full ${toneClasses[tone]}`}
    >
      <AppIcon icon={icon} fontSize={20} />
    </span>
  );
}

export default SnackbarIcon;
