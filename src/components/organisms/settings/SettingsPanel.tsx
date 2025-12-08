import BaseButton from "../../atoms/base/buttons/BaseButton";
import AppIcon from "../../atoms/icon/AppIcon";
import NavColorPanel from "../../molecules/settings/NavColorPanel";
import type { NavColor } from "../../molecules/settings/NavColorPanel";
import NavigationMenuPanel from "../../molecules/settings/NavigationMenuPanel";
import type { NavigationMenuType } from "../../molecules/settings/NavigationMenuPanel";
import SidenavShapePanel from "../../molecules/settings/SidenavShapePanel";
import type { SidenavShape } from "../../molecules/settings/SidenavShapePanel";
import TextDirectionPanel from "../../molecules/settings/TextDirectionPanel";
import type { TextDirection } from "../../molecules/settings/TextDirectionPanel";
import ThemeModeToggleTab from "../../molecules/settings/ThemeModeToggleTab";
import type { ThemeMode } from "../../molecules/settings/ThemeModeToggleTab";
import TopnavShapePanel from "../../molecules/settings/TopnavShapePanel";
import type { TopnavShape } from "../../molecules/settings/TopnavShapePanel";
import SectionHeader from "../../molecules/content/SectionHeader";

export type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  onReset?: () => void;
  themeMode: ThemeMode;
  onThemeModeChange: (mode: ThemeMode) => void;
  textDirection: TextDirection;
  onTextDirectionChange: (dir: TextDirection) => void;
  navigationMenuType: NavigationMenuType;
  onNavigationMenuTypeChange: (type: NavigationMenuType) => void;
  sidenavShape: SidenavShape;
  onSidenavShapeChange: (shape: SidenavShape) => void;
  topnavShape: TopnavShape;
  onTopnavShapeChange: (shape: TopnavShape) => void;
  navColor: NavColor;
  onNavColorChange: (color: NavColor) => void;
};

export function SettingsPanel({
  open,
  onClose,
  onReset,
  themeMode,
  onThemeModeChange,
  textDirection,
  onTextDirectionChange,
  navigationMenuType,
  onNavigationMenuTypeChange,
  sidenavShape,
  onSidenavShapeChange,
  topnavShape,
  onTopnavShapeChange,
  navColor,
  onNavColorChange,
}: SettingsPanelProps) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-white shadow-2xl transition duration-200 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-emerald-400 px-4 py-3 text-white">
        <div className="text-sm font-semibold flex-1">Customize</div>
        <BaseButton
          variant="soft"
          color="neutral"
          size="sm"
          onClick={onReset}
          startIcon={<AppIcon icon="material-symbols:reset-settings-rounded" />}
          className="bg-white/10 text-white"
        >
          Reset
        </BaseButton>
        <BaseButton
          variant="soft"
          color="neutral"
          size="sm"
          shape="circle"
          onClick={onClose}
          className="bg-white/10 text-white"
        >
          <AppIcon icon="material-symbols:close-rounded" fontSize={20} />
        </BaseButton>
      </div>

      <div className="h-[calc(100%-140px)] overflow-y-auto px-4 py-5 space-y-6">
        <div className="space-y-4">
          <SectionHeader title="Theme Mode" />
          <ThemeModeToggleTab value={themeMode} onChange={onThemeModeChange} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Text Direction" />
          <TextDirectionPanel value={textDirection} onChange={onTextDirectionChange} />
        </div>

        <div className="space-y-4">
          <SectionHeader title="Navigation Menu" />
          <NavigationMenuPanel
            value={navigationMenuType}
            onChange={onNavigationMenuTypeChange}
          />
        </div>

        {navigationMenuType !== "topnav" && (
          <div className="space-y-4">
            <SectionHeader title="Sidenav Shape" />
            <SidenavShapePanel value={sidenavShape} onChange={onSidenavShapeChange} />
          </div>
        )}

        {navigationMenuType !== "sidenav" && (
          <div className="space-y-4">
            <SectionHeader title="Topnav Shape" />
            <TopnavShapePanel value={topnavShape} onChange={onTopnavShapeChange} />
          </div>
        )}

        <div className="space-y-4">
          <SectionHeader title="Nav Color" />
          <NavColorPanel value={navColor} onChange={onNavColorChange} />
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold bg-gradient-to-r from-emerald-500 via-blue-400 to-blue-500 bg-clip-text text-transparent">
          And more
        </div>
        <div className="text-xs text-slate-500">Coming soon...</div>
      </div>
    </div>
  );
}

export default SettingsPanel;
