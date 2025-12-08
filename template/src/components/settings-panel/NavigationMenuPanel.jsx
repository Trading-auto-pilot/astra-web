import { useSearchParams } from 'react-router';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsPanelContext } from 'providers/SettingsPanelProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { SET_NAVIGATION_MENU_TYPE } from 'reducers/SettingsReducer';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';

const NavigationMenuPanel = () => {
  const {
    config: { navigationMenuType, assetsDir },
    configDispatch,
  } = useSettingsContext();
  const [, setSearchParams] = useSearchParams();

  const {
    settingsPanelConfig: { disableNavigationMenuSection },
  } = useSettingsPanelContext();

  const handleChange = (event) => {
    setSearchParams({}, { replace: true });

    const value = event.target.value;
    configDispatch({
      type: SET_NAVIGATION_MENU_TYPE,
      payload: value,
    });
  };

  return (
    <SettingsPanelRadioGroup
      name="text-direction"
      value={navigationMenuType}
      onChange={handleChange}
    >
      <FormControlLabel
        value="sidenav"
        control={<Radio />}
        label={
          <SettingsItem
            label="Sidenav"
            image={{
              light: `${assetsDir}/images/settings-panel/sidenav.webp`,
              dark: `${assetsDir}/images/settings-panel/sitenav-dark.webp`,
            }}
            active={!disableNavigationMenuSection && navigationMenuType === 'sidenav'}
          />
        }
      />
      <FormControlLabel
        value="topnav"
        control={<Radio />}
        label={
          <SettingsItem
            label="Topnav"
            image={{
              light: `${assetsDir}/images/settings-panel/topnav.webp`,
              dark: `${assetsDir}/images/settings-panel/topnav-dark.webp`,
            }}
            active={!disableNavigationMenuSection && navigationMenuType === 'topnav'}
          />
        }
      />
      <FormControlLabel
        value="combo"
        control={<Radio />}
        label={
          <SettingsItem
            label="Combo"
            image={{
              light: `${assetsDir}/images/settings-panel/combo.webp`,
              dark: `${assetsDir}/images/settings-panel/combo-dark.webp`,
            }}
            active={!disableNavigationMenuSection && navigationMenuType === 'combo'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default NavigationMenuPanel;
