import { useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type DashboardMenuItem = {
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
};

export type DashboardMenuProps = {
  items?: DashboardMenuItem[];
  icon?: React.ReactNode;
  className?: string;
};

const defaultItems: DashboardMenuItem[] = [
  { label: "Sync" },
  { label: "Export" },
  { label: "Remove", tone: "danger" },
];

export function DashboardMenu({
  items = defaultItems,
  icon = <AppIcon icon="mdi:dots-horizontal" />,
  className = "",
}: DashboardMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <BaseButton
        variant="ghost"
        color="neutral"
        shape="square"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {icon}
      </BaseButton>

      {open && (
        <div
          className="absolute right-0 z-20 mt-1 min-w-[140px] rounded-lg border border-slate-200 bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="py-1 text-sm text-slate-700">
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  className={`flex w-full items-center px-3 py-2 text-left hover:bg-slate-50 ${
                    item.tone === "danger" ? "text-red-600" : ""
                  }`}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DashboardMenu;
