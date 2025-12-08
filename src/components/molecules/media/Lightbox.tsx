import { useEffect } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type LightboxSlide = {
  src: string;
  title?: string;
  description?: string;
};

export type LightboxProps = {
  open: boolean;
  slides: LightboxSlide[];
  activeIndex?: number;
  onClose: () => void;
};

/**
 * Lightweight lightbox: renders the active image in a fullscreen overlay.
 * No external dependencies; keep behavior minimal.
 */
export function Lightbox({ open, slides, activeIndex = 0, onClose }: LightboxProps) {
  const slide = slides[activeIndex];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open || !slide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] max-w-5xl w-full rounded-xl bg-black shadow-2xl overflow-hidden">
        <BaseButton
          shape="circle"
          variant="ghost"
          color="neutral"
          className="!absolute right-3 top-3 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <AppIcon icon="material-symbols:close" fontSize={20} />
        </BaseButton>
        <img
          src={slide.src}
          alt={slide.title || "lightbox image"}
          className="mx-auto max-h-[80vh] w-full object-contain bg-black"
        />
        {(slide.title || slide.description) && (
          <div className="px-4 py-3 text-sm text-slate-100 bg-black/70">
            {slide.title && <div className="font-semibold">{slide.title}</div>}
            {slide.description && <div className="text-slate-300">{slide.description}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Lightbox;
