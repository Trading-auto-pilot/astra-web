import { useEffect, useRef, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import StatusAvatar from "../../atoms/media/StatusAvatar";

export type UserMenuItem = {
  label: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  icon?: string;
};

export type UserMenuProps = {
  userName?: string;
  avatarUrl?: string;
  status?: "online" | "offline" | "away" | "busy";
  items?: UserMenuItem[];
  className?: string;
  onLogout?: () => void;
};

const defaultItems: UserMenuItem[] = [
  { label: "Profilo", icon: "mdi:account-circle-outline" },
  {
    label: "Impostazioni",
    icon: "mdi:cog-outline",
    onClick: () => {
      window.location.hash = "/dashboard/user-settings";
    },
  },
  { label: "Logout", icon: "mdi:logout-variant", tone: "danger" },
];

export function UserMenu({
  userName = "Utente",
  avatarUrl,
  status = "online",
  items = defaultItems,
  className = "",
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <BaseButton
        variant="ghost"
        color="neutral"
        shape="circle"
        size="lg"
        className="p-0"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <StatusAvatar
          src={avatarUrl}
          alt={userName}
          size={36}
          status={status}
          fallback={userName.charAt(0).toUpperCase()}
        />
      </BaseButton>

      {open && (
        <div className="absolute right-0 z-30 mt-2 min-w-[200px] rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">{userName}</div>
            <div className="text-xs text-slate-500">{userName}</div>
          </div>
          <ul className="py-1 text-sm text-slate-700">
            {items.map((item) => {
              const handleClick =
                item.label.toLowerCase() === "logout" && !item.onClick
                  ? () => {
                      localStorage.removeItem("astraai:auth:token");
                      localStorage.removeItem("astraai:auth:clientNavigation");
                      localStorage.removeItem("astraai:auth:username");
                      onLogout?.();
                      window.location.hash = "/login";
                    }
                  : item.onClick;

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-slate-50 ${
                      item.tone === "danger" ? "text-red-600" : ""
                    }`}
                    onClick={() => {
                      handleClick?.();
                      setOpen(false);
                    }}
                  >
                    {item.icon && <AppIcon icon={item.icon} className="text-lg" />}
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
