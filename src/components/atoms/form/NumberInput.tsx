import type { TextInputProps } from "./TextInput";
import { TextInput } from "./TextInput";

export type NumberInputProps = TextInputProps & {
  min?: number;
  max?: number;
  step?: number;
};

export function NumberInput(props: NumberInputProps) {
  return <TextInput type="number" inputMode="decimal" {...props} />;
}

export default NumberInput;
