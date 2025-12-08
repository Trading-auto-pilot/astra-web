import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import type { AttachmentPreview } from "./fileUtils";
import { convertFileToAttachment, revokePreview } from "./fileUtils";
import FilePreview from "./FilePreview";

export type FileDropBoxProps = DropzoneOptions & {
  onRemove?: (index: number) => void;
  defaultFiles?: File[];
  error?: string | boolean;
  className?: string;
};

export function FileDropBox({
  onDrop,
  onRemove,
  defaultFiles,
  error,
  className = "",
  ...rest
}: FileDropBoxProps) {
  const [previews, setPreviews] = useState<AttachmentPreview[]>([]);

  const handleRemoveFile = (index: number) => {
    const preview = previews[index];
    revokePreview(preview?.preview);
    setPreviews((prev) => prev.filter((_, ind) => ind !== index));
    if (onRemove) onRemove(index);
  };

  const dropzone = useDropzone({
    onDrop: (...args) => {
      const [acceptedFiles] = args;
      // Revoke old previews
      previews.forEach((p) => revokePreview(p.preview));
      setPreviews(acceptedFiles.map((file) => convertFileToAttachment(file)));
      if (onDrop) onDrop(...args);
    },
    ...rest,
  });

  useEffect(() => {
    if (defaultFiles && defaultFiles.length) {
      previews.forEach((p) => revokePreview(p.preview));
      setPreviews(defaultFiles.map((file) => convertFileToAttachment(file)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFiles]);

  useEffect(
    () => () => {
      previews.forEach((p) => revokePreview(p.preview));
    },
    [previews]
  );

  return (
    <div className={`flex flex-wrap gap-2 ${className || ""}`}>
      {previews.map((preview, index) => (
        <div key={preview.preview || preview.name} className="relative">
          <FilePreview preview={preview} size={56} />
          <BaseButton
            onClick={() => handleRemoveFile(index)}
            variant="solid"
            size="sm"
            shape="circle"
            color="neutral"
            className="!absolute -top-2 -right-2 h-5 w-5 p-0"
          >
            <AppIcon icon="material-symbols:close-small-rounded" fontSize={12} />
          </BaseButton>
        </div>
      ))}

      <div
        {...dropzone.getRootProps()}
        className={`flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border border-dashed ${
          error ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"
        } transition-colors hover:bg-slate-100`}
      >
        <input {...dropzone.getInputProps()} />
        <AppIcon icon="material-symbols:add-photo-alternate-outline-rounded" fontSize={20} />
      </div>
    </div>
  );
}

export default FileDropBox;
