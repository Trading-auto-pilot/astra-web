import Badge from "../../atoms/form/Badge";

export type SettingsOption = {
  label: string;
  value: string;
  hint?: string;
};

export type SettingsPanelRadioGroupProps = {
  options: SettingsOption[];
  value: string;
  onChange: (value: string) => void;
  title: string;
};

export function SettingsPanelRadioGroup({
  options,
  value,
  onChange,
  title,
}: SettingsPanelRadioGroupProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-800">{title}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition hover:border-blue-300 hover:bg-blue-50 ${
                active ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700"
              }`}
            >
              <div className="font-medium">{opt.label}</div>
              {opt.hint && (
                <Badge tone={active ? "primary" : "neutral"} className="mt-1 inline-flex">
                  {opt.hint}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsPanelRadioGroup;
