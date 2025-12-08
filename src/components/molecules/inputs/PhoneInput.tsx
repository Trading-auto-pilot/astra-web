import { useEffect, useState } from "react";
import CountrySelect from "./CountrySelect";
import TextInput from "../../atoms/form/TextInput";

export type PhoneValue = {
  countryCode: string;
  number: string;
};

export type PhoneInputProps = {
  countries?: { label: string; value: string; phone: string; flagIcon?: string }[];
  defaultValue?: PhoneValue;
  onChange?: (value: PhoneValue) => void;
  className?: string;
};

const DEFAULT_COUNTRIES = [
  { label: "United States", value: "US", phone: "1", flagIcon: "emojione:flag-for-united-states" },
  { label: "Italy", value: "IT", phone: "39", flagIcon: "emojione:flag-for-italy" },
  { label: "Japan", value: "JP", phone: "81", flagIcon: "emojione:flag-for-japan" },
];

export function PhoneInput({
  countries = DEFAULT_COUNTRIES,
  defaultValue,
  onChange,
  className = "",
}: PhoneInputProps) {
  const [selected, setSelected] = useState(countries[0]);
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (defaultValue) {
      const found = countries.find((c) => c.value === defaultValue.countryCode);
      setSelected(found || countries[0]);
      setNumber(defaultValue.number || "");
    }
  }, [defaultValue, countries]);

  const emitChange = (nextCountry = selected, nextNumber = number) => {
    onChange?.({
      countryCode: nextCountry.value,
      number: nextNumber,
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-32">
        <CountrySelect
          value={selected.value}
          onChange={(val) => {
            const country = countries.find((c) => c.value === val) || countries[0];
            setSelected(country);
            emitChange(country, number);
          }}
          options={countries.map((c) => ({
            label: `${c.label} (+${c.phone})`,
            value: c.value,
          }))}
          showFlag
          showCode
        />
      </div>
      <TextInput
        type="tel"
        placeholder="123 456 7890"
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
          emitChange(selected, e.target.value);
        }}
        addonLeft={<span className="text-slate-500">+{selected.phone}</span>}
      />
    </div>
  );
}

export default PhoneInput;
