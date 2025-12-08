import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";

export type SettingPanelTogglerProps = {
  onOpen: () => void;
};

export function SettingPanelToggler({ onOpen }: SettingPanelTogglerProps) {
  return (
    <BaseButton
      variant="soft"
      color="neutral"
      size="md"
      startIcon={<AppIcon icon="mdi:cog-outline" className="animate-spin-slow" />}
      className="fixed right-0 top-1/2 -translate-y-1/2 rotate-[-90deg] rounded-b-none rounded-t-lg border border-slate-200 bg-white shadow-md"
      onClick={onOpen}
    >
      Customize
    </BaseButton>
  );
}

export default SettingPanelToggler;
