import BaseButton from "../../atoms/base/buttons/BaseButton";

export type TextDirection = "ltr" | "rtl";

export type TextDirectionPanelProps = {
  value: TextDirection;
  onChange: (dir: TextDirection) => void;
};

export function TextDirectionPanel({ value, onChange }: TextDirectionPanelProps) {
  return (
    <div className="flex gap-2">
      {(["ltr", "rtl"] as TextDirection[]).map((dir) => (
        <BaseButton
          key={dir}
          variant={value === dir ? "solid" : "outline"}
          color="neutral"
          size="sm"
          onClick={() => onChange(dir)}
        >
          {dir.toUpperCase()}
        </BaseButton>
      ))}
    </div>
  );
}

export default TextDirectionPanel;
