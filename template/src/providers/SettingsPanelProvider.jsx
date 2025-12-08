import { createContext, use, useState } from 'react';

export const SettingsPanelContext = createContext({});

const SettingsPanelProvider = ({ children }) => {
  const [settingsPanelConfig, setSettingsPanelConfig] = useState({
    showSettingPanelButton: true,
    openSettingPanel: false,
    disableNavigationMenuSection: false,
    disableSidenavShapeSection: false,
    disableTopShapeSection: false,
    disableNavColorSection: false,
  });

  const updateSettingsPanelConfig = (config) => {
    setSettingsPanelConfig({
      ...settingsPanelConfig,
      ...config,
    });
  };

  return (
    <SettingsPanelContext
      value={{
        settingsPanelConfig,
        setSettingsPanelConfig: updateSettingsPanelConfig,
      }}
    >
      {children}
    </SettingsPanelContext>
  );
};

export default SettingsPanelProvider;

export const useSettingsPanelContext = () => use(SettingsPanelContext);
