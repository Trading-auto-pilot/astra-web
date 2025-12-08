import { useEffect, useState } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import FormLabel from "../../atoms/form/FormLabel";
import AppIcon from "../../atoms/icon/AppIcon";

export type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  label?: string;
  onChange?: (color: string) => void;
  swatches?: string[];
  className?: string;
};

const DEFAULT_SWATCHES = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#6b7280", "#000000"];

/**
 * Lightweight color picker using native color input and optional swatches.
 * Avoids extra dependencies; emits hex string.
 */
export function ColorPicker({
  value,
  defaultValue = "#2563eb",
  label,
  onChange,
  swatches = DEFAULT_SWATCHES,
  className = "",
}: ColorPickerProps) {
  const [color, setColor] = useState(value || defaultValue);

  useEffect(() => {
    if (value) setColor(value);
  }, [value]);

  const handleChange = (next: string) => {
    setColor(next);
    onChange?.(next);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border border-slate-200 bg-white p-1"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">{color.toUpperCase()}</span>
          <BaseButton
            variant="outline"
            color="neutral"
            size="sm"
            onClick={() => handleChange(defaultValue)}
            startIcon={<AppIcon icon="mdi:restart" fontSize={16} />}
          >
            Reset
          </BaseButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => handleChange(swatch)}
            className={`h-8 w-8 rounded-full border border-slate-200 shadow-sm transition hover:scale-105 ${
              swatch.toLowerCase() === color.toLowerCase() ? "ring-2 ring-blue-500" : ""
            }`}
            style={{ backgroundColor: swatch }}
            aria-label={`Choose ${swatch}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;
