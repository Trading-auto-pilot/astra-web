import React from "react";

export type Status = "online" | "offline" | "away" | "busy";

export type StatusAvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  status?: Status;
  className?: string;
  fallback?: React.ReactNode;
};

const statusColor: Record<Status, string> = {
  online: "bg-emerald-500",
  offline: "bg-slate-400",
  away: "bg-amber-400",
  busy: "bg-red-500",
};

export function StatusAvatar({
  src,
  alt = "",
  size = 40,
  status = "offline",
  className = "",
  fallback,
}: StatusAvatarProps) {
  const dimensionStyle: React.CSSProperties = { width: size, height: size };
  const dotSize = Math.max(8, Math.round(size * 0.22));

  return (
    <div
      className={`relative inline-flex rounded-full bg-slate-100 overflow-hidden ${className}`}
      style={dimensionStyle}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={dimensionStyle}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-600 bg-slate-200"
          style={dimensionStyle}
        >
          {fallback || (alt ? alt.charAt(0).toUpperCase() : "?")}
        </div>
      )}

      <span
        className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white ${statusColor[status]}`}
        style={{ width: dotSize, height: dotSize }}
        aria-label={`status-${status}`}
      />
    </div>
  );
}

export default StatusAvatar;
