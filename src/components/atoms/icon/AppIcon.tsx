import React from "react";
import { Icon } from "@iconify/react";

export type AppIconProps = {
  icon: string;
  className?: string;
  fontSize?: number | string;
  flipOnRtl?: boolean;
} & React.ComponentProps<typeof Icon>;

/**
 * Icon wrapper atom based on Iconify.
 * Sostituisce IconifyIcon MUI-based.
 */
export default function AppIcon({
  icon,
  className = "",
  fontSize = 20,
  flipOnRtl = false,
  style,
  ...rest
}: AppIconProps) {
  // se in futuro avrai un context per RTL puoi applicare qui il flip
  const mergedStyle: React.CSSProperties = {
    fontSize,
    verticalAlign: "baseline",
    ...(style || {}),
  };

  return (
    <Icon
      icon={icon}
      className={`iconify ${className}`}
      style={mergedStyle}
      {...rest}
    />
  );
}
