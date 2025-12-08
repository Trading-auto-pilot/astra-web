import type { VideoHTMLAttributes } from "react";

export type AppVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  sourceType?: string;
};

export function AppVideo({ src, sourceType = "video/webm", children, ...rest }: AppVideoProps) {
  return (
    <video {...rest}>
      {src && <source src={src} type={sourceType} />}
      {children}
    </video>
  );
}

export default AppVideo;
