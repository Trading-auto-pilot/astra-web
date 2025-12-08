// src/components/atoms/buttons/UploadButton.tsx
import type { ChangeEventHandler } from "react";
import { useRef } from "react";
import { BaseButton } from "./BaseButton";
import type { BaseButtonProps } from "./BaseButton";

export type UploadButtonProps = {
  label?: string;
  onFilesSelected?: (files: FileList) => void;
} & Omit<BaseButtonProps, "onClick">;

export function UploadButton({
  label = "Upload file",
  onFilesSelected,
  ...rest
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && onFilesSelected) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <>
      <BaseButton
        variant={rest.variant ?? "solid"}
        startIcon={rest.startIcon}
        onClick={handleClick}
        {...rest}
      >
        {label}
      </BaseButton>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}

export default UploadButton;
