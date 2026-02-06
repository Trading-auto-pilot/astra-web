import { useCallback } from "react";
import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

type ChannelUiState = {
  on: boolean;
  intervalsMs: string;
  params?: Record<string, any>;
};

type Props = {
  microservice: string;
  channels: Record<string, ChannelUiState>;
  originalChannels: Record<string, ChannelUiState>;
  communicationRaw: Record<string, any> | null;
  communicationMax: number | null;
  status: "idle" | "loading" | "error";
  saving: boolean;
  error: string | null;
  success: string | null;
  onChannelsChange: (channels: Record<string, ChannelUiState>) => void;
  onToggleChannel: (key: string) => void;
  onSaveChannels: () => void;
};

export default function MicroserviceCommunicationChannelsCard({
  channels,
  originalChannels,
  status,
  saving,
  error,
  success,
  onChannelsChange,
  onToggleChannel,
  onSaveChannels,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-700">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-700">Communication channels</div>
        {status === "loading" && <span className="text-[11px] text-slate-500">Caricamento...</span>}
      </div>
      {error && <div className="mb-2 text-[11px] text-amber-700">{error}</div>}
      {success && <div className="mb-2 text-[11px] text-emerald-700">{success}</div>}
      <div className="rounded-md border border-slate-100 bg-white">
        {Object.entries(channels || {}).map(([key, ch]) => (
          <div key={key} className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-b-0">
            <div className="w-32 text-[11px] font-semibold text-slate-600 capitalize">{key}</div>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={!!ch.on}
                onChange={() => onToggleChannel(key)}
                disabled={saving}
              />
              <span
                className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                  ch.on ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                } ${saving ? "opacity-70" : ""}`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white shadow transition ${
                    ch.on ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-700">{ch.on ? "On" : "Off"}</span>
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">intervalsMs</span>
              <input
                type="number"
                min={1}
                className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-400 focus:outline-none"
                value={ch.intervalsMs}
                onChange={(e) =>
                  onChannelsChange({
                    ...channels,
                    [key]: {
                      ...(channels[key] || { on: false, params: {} }),
                      intervalsMs: e.target.value,
                      params: channels[key]?.params || originalChannels[key]?.params || {},
                    },
                  })
                }
                disabled={saving}
              />
            </div>
            {ch.params && Object.keys(ch.params).length > 1 && (
              <div className="ml-auto text-[11px] text-slate-500">
                {Object.entries(ch.params)
                  .filter(([k]) => k !== "intervalsMs")
                  .map(([k, v]) => (
                    <div key={k} className="text-[11px]">
                      {k}: {String(v)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
        {Object.keys(channels || {}).length === 0 && status !== "loading" && (
          <div className="px-3 py-2 text-[11px] text-slate-500">Nessun channel disponibile</div>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <BaseButton
          variant="outline"
          color="neutral"
          size="sm"
          startIcon={<AppIcon icon="mdi:content-save-outline" />}
          disabled={saving || status === "loading"}
          onClick={onSaveChannels}
        >
          Save channels
        </BaseButton>
      </div>
    </div>
  );
}
