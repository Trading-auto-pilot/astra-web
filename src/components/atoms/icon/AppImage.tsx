import React from "react";

type ThemedSrc =
  | string
  | {
      light: string;
      dark: string;
    };

export type AppImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: ThemedSrc;
  /** Modalità scura/chiara – per ora la passiamo come prop.
   * In seguito potrai collegarla al tuo hook useThemeMode.
   */
  isDark?: boolean;
};

export default function AppImage({
  src,
  isDark = false,
  ...rest
}: AppImageProps) {
  const resolvedSrc =
    typeof src === "string"
      ? src
      : isDark
      ? (src as { dark: string }).dark
      : (src as { light: string }).light;

  return <img src={resolvedSrc} {...rest} />;
}
