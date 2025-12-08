import AppIcon from "../../atoms/icon/AppIcon";
import type { AttachmentPreview } from "./fileUtils";
import { getFileIcon } from "./fileUtils";

export type FilePreviewProps = {
  preview: AttachmentPreview;
  size?: number;
};

export function FilePreview({ preview, size = 56 }: FilePreviewProps) {
  const style: React.CSSProperties = { width: size, height: size };

  if (preview.preview) {
    return (
      <img
        src={preview.preview}
        alt={preview.name}
        className="h-full w-full rounded-md border border-slate-200 object-cover"
        style={style}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500"
      style={style}
    >
      <AppIcon icon={getFileIcon(preview.format)} fontSize={20} />
    </div>
  );
}

export default FilePreview;
