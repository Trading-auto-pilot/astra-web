import FormLabel from "../../atoms/form/FormLabel";
import TextInput from "../../atoms/form/TextInput";

export type DateRangePickerProps = {
  label?: string;
  startDate?: string;
  endDate?: string;
  onChange?: (dates: [string, string]) => void;
  className?: string;
};

/**
 * Lightweight date range picker built on native date inputs (no extra deps).
 * Emits ISO date strings (YYYY-MM-DD). Consumers can convert to Date if needed.
 */
export function DateRangePicker({
  label,
  startDate = "",
  endDate = "",
  onChange,
  className = "",
}: DateRangePickerProps) {
  const handleStart = (value: string) => onChange?.([value, endDate]);
  const handleEnd = (value: string) => onChange?.([startDate, value]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextInput
          type="date"
          value={startDate}
          onChange={(e) => handleStart(e.target.value)}
          label="Start date"
        />
        <TextInput
          type="date"
          value={endDate}
          onChange={(e) => handleEnd(e.target.value)}
          label="End date"
        />
      </div>
    </div>
  );
}

export default DateRangePicker;
