import SelectInput from "../../atoms/form/SelectInput";

export type DashboardSelectOption = {
  value: string | number;
  label: string;
};

export type DashboardSelectMenuProps = {
  options?: DashboardSelectOption[];
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  className?: string;
};

const DEFAULT_OPTIONS: DashboardSelectOption[] = [
  { value: 1, label: "Last month" },
  { value: 6, label: "Last 6 months" },
  { value: 12, label: "Last 12 months" },
];

export function DashboardSelectMenu({
  options = DEFAULT_OPTIONS,
  defaultValue,
  onChange,
  className = "",
}: DashboardSelectMenuProps) {
  return (
    <div className={`min-w-[160px] ${className}`}>
      <SelectInput
        value={defaultValue ?? options[0]?.value}
        onChange={(e) => onChange?.(e.target.value)}
        options={options}
      />
    </div>
  );
}

export default DashboardSelectMenu;
