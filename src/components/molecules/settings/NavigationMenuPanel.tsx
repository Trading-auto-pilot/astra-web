import SettingsPanelRadioGroup from "./SettingsPanelRadioGroup";

export type NavigationMenuType = "sidenav" | "topnav";

export type NavigationMenuPanelProps = {
  value: NavigationMenuType;
  onChange: (val: NavigationMenuType) => void;
};

export function NavigationMenuPanel({ value, onChange }: NavigationMenuPanelProps) {
  return (
    <SettingsPanelRadioGroup
      title="Navigation Menu"
      value={value}
      onChange={(val) => onChange(val as NavigationMenuType)}
      options={[
        { label: "Side navigation", value: "sidenav", hint: "Vertical" },
        { label: "Top navigation", value: "topnav", hint: "Horizontal" },
      ]}
    />
  );
}

export default NavigationMenuPanel;
