export type AttachmentPreview = {
  name: string;
  sizeLabel: string;
  preview?: string;
  format: string;
  file?: File;
};

const BYTE_UNITS = ["B", "KB", "MB", "GB"];

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  );
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${BYTE_UNITS[exponent]}`;
}

export function convertFileToAttachment(file: File): AttachmentPreview {
  const isImage = file.type.startsWith("image/");
  const ext = file.name.split(".").pop() || file.type || "file";
  return {
    name: file.name,
    sizeLabel: formatBytes(file.size),
    preview: isImage ? URL.createObjectURL(file) : undefined,
    format: ext.toLowerCase(),
    file,
  };
}

export function revokePreview(preview?: string) {
  if (preview) URL.revokeObjectURL(preview);
}

export function getFileIcon(format: string): string {
  const ext = format.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return "mdi:file-image";
  if (["pdf"].includes(ext)) return "mdi:file-pdf-box";
  if (["doc", "docx"].includes(ext)) return "mdi:file-word-box";
  if (["xls", "xlsx", "csv"].includes(ext)) return "mdi:file-excel-box";
  if (["mp4", "mov", "avi"].includes(ext)) return "mdi:file-video";
  if (["mp3", "wav", "aac"].includes(ext)) return "mdi:file-music";
  if (["zip", "rar", "7z"].includes(ext)) return "mdi:folder-zip-outline";
  return "mdi:file-outline";
}
