import { useSearchParams } from 'react-router';
import { Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { useThemeMode } from 'hooks/useThemeMode';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const ThemeModeToggleTab = () => {
  const { mode, setThemeMode } = useThemeMode();
  const [, setSearchParams] = useSearchParams();

  const handleChange = (_event, newValue) => {
    setSearchParams({}, { replace: true });
    setThemeMode(newValue);
  };

  return (
    <Tabs
      value={mode}
      onChange={handleChange}
      sx={({ vars, transitions }) => ({
        bgcolor: 'primary.lighter',
        p: 0.5,
        borderRadius: 2,
        [`& .${tabsClasses.list}`]: {
          gap: 0,
        },
        [`& .${tabsClasses.indicator}`]: {
          height: 1,
          bgcolor: cssVarRgba(vars.palette.primary.mainChannel, 0.2),
          borderRadius: 1,
          transition: `${transitions.create('all', {
            duration: transitions.duration.short,
          })} !important`,
        },
        [`& .${tabClasses.root}`]: {
          color: 'text.primary',
          fontWeight: 600,
          [`&.${tabClasses.selected}`]: {
            color: 'primary.dark',
          },
        },
      })}
    >
      <Tab
        value="light"
        label="Light"
        icon={<IconifyIcon icon="material-symbols:light-mode-outline-rounded" fontSize={18} />}
        iconPosition="start"
        disableRipple
        sx={{ px: 1.25 }}
      />
      <Tab
        value="dark"
        label="Dark"
        icon={<IconifyIcon icon="material-symbols-light:dark-mode-outline-rounded" fontSize={20} />}
        iconPosition="start"
        disableRipple
        sx={{ px: 1.25 }}
      />
      <Tab
        value="system"
        label="System"
        icon={<IconifyIcon icon="material-symbols:monitor-outline-rounded" fontSize={18} />}
        iconPosition="start"
        disableRipple
        sx={{ px: 1.25 }}
      />
    </Tabs>
  );
};

export default ThemeModeToggleTab;
