import { useState } from "react";
import TextInput from "../../atoms/form/TextInput";
import type { TextInputProps } from "../../atoms/form/TextInput";
import AppIcon from "../../atoms/icon/AppIcon";

export type PasswordInputProps = Omit<TextInputProps, "type"> & {
  toggleLabel?: string;
};

export function PasswordInput({
  toggleLabel = "Show",
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      type={visible ? "text" : "password"}
      addonRight={
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        >
          <AppIcon
            icon={
              visible
                ? "material-symbols-light:visibility-outline-rounded"
                : "material-symbols-light:visibility-off-outline-rounded"
            }
            fontSize={16}
          />
          {toggleLabel}
        </button>
      }
      {...rest}
    />
  );
}

export default PasswordInput;
