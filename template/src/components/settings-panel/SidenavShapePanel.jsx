import { useSearchParams } from 'react-router';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsPanelContext } from 'providers/SettingsPanelProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { SET_SIDENAV_SHAPE } from 'reducers/SettingsReducer';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';

const SidenavShapePanel = () => {
  const {
    config: { sidenavType, assetsDir },
    configDispatch,
  } = useSettingsContext();
  const [, setSearchParams] = useSearchParams();

  const {
    settingsPanelConfig: { disableSidenavShapeSection },
  } = useSettingsPanelContext();

  const handleChange = (event) => {
    setSearchParams({}, { replace: true });

    const value = event.target.value;

    configDispatch({
      type: SET_SIDENAV_SHAPE,
      payload: value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="sidenav-shape" value={sidenavType} onChange={handleChange}>
      <FormControlLabel
        value="default"
        control={<Radio />}
        label={
          <SettingsItem
            label="Default"
            image={{
              light: `${assetsDir}/images/settings-panel/sidenav-default.webp`,
              dark: `${assetsDir}/images/settings-panel/sidenav-default-dark.webp`,
            }}
            active={!disableSidenavShapeSection && sidenavType === 'default'}
          />
        }
      />
      <FormControlLabel
        value="slim"
        control={<Radio />}
        label={
          <SettingsItem
            label="Slim"
            image={{
              light: `${assetsDir}/images/settings-panel/slim.webp`,
              dark: `${assetsDir}/images/settings-panel/slim-dark.webp`,
            }}
            active={!disableSidenavShapeSection && sidenavType === 'slim'}
          />
        }
      />
      <FormControlLabel
        value="stacked"
        control={<Radio />}
        label={
          <SettingsItem
            label="Stacked"
            image={{
              light: `${assetsDir}/images/settings-panel/stacked.webp`,
              dark: `${assetsDir}/images/settings-panel/stacked-dark.webp`,
            }}
            active={!disableSidenavShapeSection && sidenavType === 'stacked'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default SidenavShapePanel;
