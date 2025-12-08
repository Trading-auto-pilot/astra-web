import { useEffect } from 'react';
import { useSettingsPanelContext } from 'providers/SettingsPanelProvider';

const useSettingsPanelMountEffect = (effects) => {
  const { settingsPanelConfig, setSettingsPanelConfig } = useSettingsPanelContext();

  useEffect(() => {
    setSettingsPanelConfig(effects);
    const undoEffects = Object.keys(effects).reduce((acc, effect) => {
      acc[effect] = settingsPanelConfig[effect];

      return acc;
    }, {});

    return () => {
      setSettingsPanelConfig(undoEffects);
    };
  }, []);
};

export default useSettingsPanelMountEffect;
