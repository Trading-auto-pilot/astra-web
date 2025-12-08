import SettingsPanelRadioGroup from "./SettingsPanelRadioGroup";

export type NavColor = "light" | "dark" | "colorful";

export type NavColorPanelProps = {
  value: NavColor;
  onChange: (val: NavColor) => void;
};

export function NavColorPanel({ value, onChange }: NavColorPanelProps) {
  return (
    <SettingsPanelRadioGroup
      title="Nav color"
      value={value}
      onChange={(val) => onChange(val as NavColor)}
      options={[
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Colorful", value: "colorful" },
      ]}
    />
  );
}

export default NavColorPanel;
