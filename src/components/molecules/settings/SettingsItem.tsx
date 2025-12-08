import { useState } from "react";
import AppImage from "../../atoms/icon/AppImage";
import AppIcon from "../../atoms/icon/AppIcon";

export type SettingsItemProps = {
  label: string;
  image: string;
  active?: boolean;
  onSelect?: () => void;
};

export function SettingsItem({ label, image, active, onSelect }: SettingsItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="SettingsItem relative w-full cursor-pointer rounded-lg border border-transparent bg-transparent text-center transition"
    >
      <div
        className={`relative mb-2 h-24 overflow-hidden rounded-lg border ${
          active || isHovered ? "border-blue-500 shadow-md" : "border-slate-200"
        }`}
      >
        <AppImage src={image} alt={label} className="h-full w-full object-cover" />
        {(active || isHovered) && (
          <span className="absolute inset-0 rounded-lg bg-blue-500/10" aria-hidden />
        )}
        {active && (
          <AppIcon
            icon="material-symbols:check-circle-rounded"
            className="absolute right-2 top-2 text-blue-600"
            fontSize={22}
          />
        )}
      </div>
      <div
        className={`text-sm font-medium ${
          active || isHovered ? "text-blue-600" : "text-slate-500"
        }`}
      >
        {label}
      </div>
    </button>
  );
}

export default SettingsItem;
