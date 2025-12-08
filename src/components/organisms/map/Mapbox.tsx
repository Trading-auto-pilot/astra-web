import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type MapboxProps = {
  center?: [number, number]; // lng, lat
  zoom?: number;
  className?: string;
};

/**
 * Placeholder map component. Renders a simple card with coordinates and disabled zoom buttons.
 * Swap with a real Mapbox/Leaflet implementation when tokens and deps are available.
 */
export function Mapbox({ center = [0, 0], zoom = 2, className = "" }: MapboxProps) {
  return (
    <div
      className={`relative h-64 w-full overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-emerald-50 p-4 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">Mapbox placeholder</div>
          <div className="text-xs text-slate-500">Center: {center[0]}, {center[1]} · Zoom: {zoom}</div>
        </div>
        <div className="flex flex-col gap-2">
          <BaseButton variant="soft" color="neutral" size="sm" shape="circle" disabled>
            <AppIcon icon="material-symbols:zoom-in-rounded" />
          </BaseButton>
          <BaseButton variant="soft" color="neutral" size="sm" shape="circle" disabled>
            <AppIcon icon="material-symbols:zoom-out-rounded" />
          </BaseButton>
        </div>
      </div>
      <div className="mt-4 flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 text-xs text-slate-500">
        Map visualization not available (no Mapbox token/deps)
      </div>
    </div>
  );
}

export default Mapbox;
