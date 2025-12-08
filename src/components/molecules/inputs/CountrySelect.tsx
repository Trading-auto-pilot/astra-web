import SelectInput from "../../atoms/form/SelectInput";
import type { SelectOption } from "../../atoms/form/SelectInput";
import AppIcon from "../../atoms/icon/AppIcon";

export type CountryOption = SelectOption & {
  flagIcon?: string;
  phone?: string;
  code?: string;
};

const defaultCountries: CountryOption[] = [
  { label: "United States", value: "US", code: "US", phone: "+1", flagIcon: "emojione:flag-for-united-states" },
  { label: "Italy", value: "IT", code: "IT", phone: "+39", flagIcon: "emojione:flag-for-italy" },
  { label: "Japan", value: "JP", code: "JP", phone: "+81", flagIcon: "emojione:flag-for-japan" },
  { label: "United Kingdom", value: "GB", code: "GB", phone: "+44", flagIcon: "emojione:flag-for-united-kingdom" },
];

export type CountrySelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "onChange"
> & {
  options?: CountryOption[];
  showFlag?: boolean;
  showCode?: boolean;
  showPhone?: boolean;
  label?: string;
  onChange?: (value: string) => void;
};

export function CountrySelect({
  options = defaultCountries,
  showFlag = true,
  showCode = false,
  showPhone = false,
  label = "Country",
  onChange,
  value,
  ...rest
}: CountrySelectProps) {
  const renderedOptions: SelectOption[] = options.map((opt) => ({
    label: `${showFlag ? "" : ""}${opt.label} ${showCode ? `(${opt.code})` : ""} ${
      showPhone ? opt.phone || "" : ""
    }`,
    value: opt.value,
  }));

  return (
    <div className="space-y-1">
      <SelectInput
        label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        options={renderedOptions}
        {...rest}
      />
      {showFlag && (
        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
          {options.slice(0, 6).map((opt) => (
            <span key={opt.value} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1">
              {opt.flagIcon && <AppIcon icon={opt.flagIcon} fontSize={14} />}
              {opt.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default CountrySelect;
