import { useSearchParams } from 'react-router';
import { FormControlLabel, Radio } from '@mui/material';
import { useSettingsContext } from 'providers/SettingsProvider';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';

const TopnavShapePanel = () => {
  const {
    config: { topnavType, assetsDir },
    setConfig,
  } = useSettingsContext();
  const [, setSearchParams] = useSearchParams();

  const handleChange = (event) => {
    setSearchParams({}, { replace: true });
    const value = event.target.value;
    setConfig({
      topnavType: value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="sidenav-shape" value={topnavType} onChange={handleChange}>
      <FormControlLabel
        value="default"
        control={<Radio />}
        label={
          <SettingsItem
            label="Default"
            image={{
              light: `${assetsDir}/images/settings-panel/topnav-default.webp`,
              dark: `${assetsDir}/images/settings-panel/topnav-default-dark.webp`,
            }}
            active={topnavType === 'default'}
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
              light: `${assetsDir}/images/settings-panel/topnav-slim.webp`,
              dark: `${assetsDir}/images/settings-panel/topnav-slim-dark.webp`,
            }}
            active={topnavType === 'slim'}
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
              light: `${assetsDir}/images/settings-panel/topnav-stacked.webp`,
              dark: `${assetsDir}/images/settings-panel/topnav-stacked-dark.webp`,
            }}
            active={topnavType === 'stacked'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default TopnavShapePanel;
