import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export type AvatarDropBoxProps = {
  /** Chiamata quando l'utente seleziona un file */
  onFileSelected?: (file: File) => void;
  /** Se true colora il bordo/essere come errore */
  error?: boolean;
  /** URL string o File iniziale */
  defaultFile?: string | File;
  /** Dimensione in px (width = height) */
  size?: number;
  /** Testo sotto l’icona */
  label?: string;
  className?: string;
};

type PreviewState = {
  name: string;
  url: string;
} | null;

export function AvatarDropBox({
  onFileSelected,
  error = false,
  defaultFile,
  size = 144,
  label = "Upload avatar",
  className = "",
}: AvatarDropBoxProps) {
  const [preview, setPreview] = useState<PreviewState>(null);

  // gestione dropzone
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setPreview({ name: file.name, url });
        onFileSelected?.(file);
      }
    },
  });

  // gestisce defaultFile (string URL o File)
  useEffect(() => {
    if (!defaultFile) {
      setPreview(null);
      return;
    }

    if (typeof defaultFile === "string") {
      setPreview({
        name: defaultFile.split("/").pop() || "avatar",
        url: defaultFile,
      });
    } else {
      const url = URL.createObjectURL(defaultFile);
      setPreview({ name: defaultFile.name, url });

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [defaultFile]);

  // cleanup URL creati da onDrop
  useEffect(() => {
    return () => {
      if (preview?.url && typeof defaultFile !== "string") {
        URL.revokeObjectURL(preview.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeStyle: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div
      {...getRootProps()}
      style={sizeStyle}
      className={`
        relative rounded-full border border-dashed overflow-hidden cursor-pointer
        flex items-center justify-center text-center
        transition-colors
        ${error ? "border-red-500 bg-red-50" : "border-zinc-300 bg-zinc-900/5"}
        hover:bg-zinc-900/10
        group
        ${className}
      `}
    >
      <input {...getInputProps()} />

      {/* immagine */}
      {preview && (
        <img
          src={preview.url}
          alt={preview.name}
          className="w-full h-full object-cover rounded-full"
        />
      )}

      {/* overlay con icona + testo */}
      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center gap-1
          text-xs text-zinc-600
          transition-all
          ${preview ? "opacity-0 group-hover:opacity-100 bg-white/80" : "opacity-100"}
        `}
      >
        {/* icona camera semplice */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-zinc-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        {size >= 100 && <span>{label}</span>}
      </div>
    </div>
  );
}

export default AvatarDropBox;
