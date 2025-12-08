import SettingsPanelRadioGroup from "./SettingsPanelRadioGroup";

export type TopnavShape = "floating" | "flat";

export type TopnavShapePanelProps = {
  value: TopnavShape;
  onChange: (val: TopnavShape) => void;
};

export function TopnavShapePanel({ value, onChange }: TopnavShapePanelProps) {
  return (
    <SettingsPanelRadioGroup
      title="Topnav shape"
      value={value}
      onChange={(val) => onChange(val as TopnavShape)}
      options={[
        { label: "Floating", value: "floating" },
        { label: "Flat", value: "flat" },
      ]}
    />
  );
}

export default TopnavShapePanel;
