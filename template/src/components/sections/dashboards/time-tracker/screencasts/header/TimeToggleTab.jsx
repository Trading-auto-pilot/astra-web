import { useState } from 'react';
import { Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { cssVarRgba } from 'lib/utils';

const TimeToggleTab = () => {
  const [time, setTime] = useState('10 min');
  const handleChange = (_event, newTime) => {
    setTime(newTime);
  };

  return (
    <Tabs
      value={time}
      onChange={handleChange}
      sx={(theme) => ({
        p: 0.5,
        borderRadius: 1.5,
        flexShrink: 0,
        bgcolor: 'background.elevation1',
        [`& .${tabsClasses.list}`]: {
          gap: 0,
        },
        [`& .${tabsClasses.indicator}`]: {
          height: 1,
          bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
          borderRadius: 2,
        },
        [`& .${tabClasses.root}`]: {
          color: 'text.primary',
          fontWeight: 600,
          textTransform: 'none',
          [`&.${tabClasses.selected}`]: {
            color: 'primary.dark',
          },
        },
      })}
    >
      <Tab value="10 min" label="10 min" disableRipple sx={{ px: 2 }} />
      <Tab value="30 min" label="30 min" disableRipple sx={{ px: 2 }} />
      <Tab value="all" label="All" disableRipple sx={{ px: 2 }} />
    </Tabs>
  );
};

export default TimeToggleTab;
