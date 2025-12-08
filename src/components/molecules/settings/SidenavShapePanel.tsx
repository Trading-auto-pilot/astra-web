import SettingsPanelRadioGroup from "./SettingsPanelRadioGroup";

export type SidenavShape = "rounded" | "square";

export type SidenavShapePanelProps = {
  value: SidenavShape;
  onChange: (val: SidenavShape) => void;
};

export function SidenavShapePanel({ value, onChange }: SidenavShapePanelProps) {
  return (
    <SettingsPanelRadioGroup
      title="Sidenav shape"
      value={value}
      onChange={(val) => onChange(val as SidenavShape)}
      options={[
        { label: "Rounded", value: "rounded" },
        { label: "Square", value: "square" },
      ]}
    />
  );
}

export default SidenavShapePanel;
