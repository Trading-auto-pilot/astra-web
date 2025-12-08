import { useSearchParams } from 'react-router';
import { FormControlLabel } from '@mui/material';
import { Radio } from '@mui/material';
import { useSettingsContext } from 'providers/SettingsProvider';
import SettingsItem from './SettingsItem';
import SettingsPanelRadioGroup from './SettingsPanelRadioGroup';

const TextDirectionPanel = () => {
  const {
    config: { textDirection, assetsDir },
    setConfig,
  } = useSettingsContext();
  const [, setSearchParams] = useSearchParams();

  const handleChange = (event) => {
    setSearchParams({}, { replace: true });

    setConfig({
      textDirection: event.target.value,
    });
  };

  return (
    <SettingsPanelRadioGroup name="text-direction" value={textDirection} onChange={handleChange}>
      <FormControlLabel
        value="ltr"
        control={<Radio />}
        label={
          <SettingsItem
            label="LTR"
            image={{
              light: `${assetsDir}/images/settings-panel/ltr.webp`,
              dark: `${assetsDir}/images/settings-panel/ltr-dark.webp`,
            }}
            active={textDirection === 'ltr'}
          />
        }
      />
      <FormControlLabel
        value="rtl"
        control={<Radio />}
        label={
          <SettingsItem
            label="RTL"
            image={{
              light: `${assetsDir}/images/settings-panel/rtl.webp`,
              dark: `${assetsDir}/images/settings-panel/rtl-dark.webp`,
            }}
            active={textDirection === 'rtl'}
          />
        }
      />
    </SettingsPanelRadioGroup>
  );
};

export default TextDirectionPanel;
