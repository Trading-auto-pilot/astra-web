import { useRef } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type SwiperProps = {
  children: React.ReactNode;
  className?: string;
  showNavigation?: boolean;
};

/**
 * Simple horizontal swiper using CSS scroll snapping.
 * For richer needs, replace with Swiper.js in the future.
 */
export function Swiper({ children, className = "", showNavigation = true }: SwiperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: "prev" | "next") => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollBy({ left: dir === "next" ? width : -width, behavior: "smooth" });
  };

  return (
    <div className={`relative ${className}`}>
      {showNavigation && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <BaseButton
            variant="soft"
            color="neutral"
            shape="circle"
            size="sm"
            className="pointer-events-auto shadow"
            onClick={() => scrollBy("prev")}
          >
            <AppIcon icon="material-symbols:chevron-left-rounded" />
          </BaseButton>
          <BaseButton
            variant="soft"
            color="neutral"
            shape="circle"
            size="sm"
            className="pointer-events-auto shadow"
            onClick={() => scrollBy("next")}
          >
            <AppIcon icon="material-symbols:chevron-right-rounded" />
          </BaseButton>
        </div>
      )}

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
      >
        {children}
      </div>
    </div>
  );
}

export default Swiper;
