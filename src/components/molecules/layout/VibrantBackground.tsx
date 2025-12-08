export type VibrantBackgroundProps = {
  variant?: "top" | "side";
  imageTop?: string;
  imageSide?: string;
  className?: string;
};

/**
 * Background overlay placeholder. If no images are provided, falls back to a gradient.
 */
export function VibrantBackground({
  variant = "top",
  imageTop,
  imageSide,
  className = "",
}: VibrantBackgroundProps) {
  const bgImage = variant === "top" ? imageTop : imageSide;
  const defaultGradient =
    "radial-gradient(circle at 10% 20%, rgba(32,222,153,0.25), transparent 35%), radial-gradient(circle at 80% 30%, rgba(125,177,245,0.25), transparent 35%)";

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : defaultGradient,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: variant === "side" ? "left top" : "center top",
        pointerEvents: "none",
      }}
    >
      <div className="absolute inset-0 bg-white/80" />
    </div>
  );
}

export default VibrantBackground;
