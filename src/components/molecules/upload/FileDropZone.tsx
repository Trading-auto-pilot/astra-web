import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { DropzoneOptions } from "react-dropzone";
import AppIcon from "../../atoms/icon/AppIcon";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import {
  convertFileToAttachment,
  formatBytes,
  revokePreview,
} from "./fileUtils";
import type { AttachmentPreview } from "./fileUtils";
import FilePreview from "./FilePreview";

export type FileDropZoneProps = DropzoneOptions & {
  onRemove?: (index: number) => void;
  defaultFiles?: File[];
  error?: string;
  previewType?: "list" | "thumbnail";
  icon?: string;
  className?: string;
};

export function FileDropZone({
  onDrop,
  onRemove,
  defaultFiles,
  error,
  previewType = "list",
  icon = "material-symbols:add-photo-alternate-outline-rounded",
  className = "",
  ...rest
}: FileDropZoneProps) {
  const [previews, setPreviews] = useState<AttachmentPreview[]>([]);

  const handleRemoveFile = (index: number) => {
    revokePreview(previews[index]?.preview);
    setPreviews((prev) => prev.filter((_, ind) => ind !== index));
    if (onRemove) onRemove(index);
  };

  const dropzone = useDropzone({
    onDrop: (...args) => {
      const [acceptedFiles] = args;
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

  const dropZoneClasses = useMemo(
    () =>
      `flex cursor-pointer items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors ${
        error
          ? "border-red-400 bg-red-50 hover:bg-red-100"
          : "border-slate-300 bg-slate-50 hover:bg-slate-100"
      } ${className}`,
    [error, className]
  );

  return (
    <div className="flex flex-col gap-4">
      <div {...dropzone.getRootProps()} className={dropZoneClasses}>
        <input {...dropzone.getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-sm text-slate-700 sm:flex-row sm:gap-3">
          <AppIcon icon={icon} fontSize={24} />
          <span>
            Drag & drop files here
            <span className="text-slate-400"> or </span>
            <span className="text-blue-600">browse from device</span>
          </span>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}

      {previews.length > 0 && previewType === "list" && (
        <ul className="flex flex-col gap-2">
          {previews.map((preview, index) => (
            <li
              key={preview.preview || preview.name}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
            >
              <FilePreview preview={preview} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{preview.name}</p>
                <p className="text-xs text-slate-500">
                  {preview.format.toUpperCase()} · {preview.sizeLabel || formatBytes(0)}
                </p>
              </div>
              <BaseButton
                variant="ghost"
                size="sm"
                color="neutral"
                onClick={() => handleRemoveFile(index)}
                className="text-slate-500 hover:text-slate-700"
              >
                <AppIcon icon="material-symbols:close-small-rounded" fontSize={16} />
              </BaseButton>
            </li>
          ))}
        </ul>
      )}

      {previews.length > 0 && previewType === "thumbnail" && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={preview.preview || preview.name} className="relative">
              <FilePreview preview={preview} size={64} />
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
        </div>
      )}
    </div>
  );
}

export default FileDropZone;
