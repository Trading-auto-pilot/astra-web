import BaseButton from "../../atoms/base/buttons/BaseButton";

export type ThemeMode = "light" | "dark" | "system";

export type ThemeModeToggleTabProps = {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
};

const modes: ThemeMode[] = ["light", "dark", "system"];

export function ThemeModeToggleTab({ value, onChange }: ThemeModeToggleTabProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {modes.map((mode) => (
        <BaseButton
          key={mode}
          variant={value === mode ? "solid" : "outline"}
          color="neutral"
          size="sm"
          className="w-full capitalize"
          onClick={() => onChange(mode)}
        >
          {mode}
        </BaseButton>
      ))}
    </div>
  );
}

export default ThemeModeToggleTab;
