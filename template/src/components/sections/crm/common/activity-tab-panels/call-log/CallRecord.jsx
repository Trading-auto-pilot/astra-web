import { useState } from 'react';
import Chip from '@mui/material/Chip';
import Collapse, { collapseClasses } from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { cssVarRgba, secondsToHms } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import CallDetails from './CallDetails';

const CallRecord = ({ call }) => {
  const [open, setOpen] = useState(false);

  return (
    <Stack
      direction="column"
      sx={{
        p: 2,
        borderRadius: 6,
        bgcolor: 'background.elevation1',
      }}
    >
      <Stack
        gap={1}
        role="button"
        onClick={() => setOpen(!open)}
        sx={{
          cursor: 'pointer',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack gap={1} sx={{ flexWrap: 'wrap', justifyContent: 'space-between', flexGrow: 1 }}>
          <Stack gap={0.5} sx={{ alignItems: 'center' }}>
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                p: 0.5,
                borderRadius: 2,
                width: 32,
                height: 32,
                bgcolor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
              }}
            >
              <IconifyIcon
                icon="material-symbols:outgoing-mail-outline"
                sx={{ fontSize: 24, color: 'primary.main' }}
              />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
              {call.caller}
            </Typography>
            <IconifyIcon icon="material-symbols:arrow-right-alt-rounded" sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
              {call.receiver}
            </Typography>
          </Stack>
          <Stack gap={0.5} sx={{ alignItems: 'center' }}>
            <Chip
              size="medium"
              color="neutral"
              variant="soft"
              label={secondsToHms(call.duration)}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', minWidth: 100, textAlign: 'right' }}
            >
              Today, {dayjs(call.time).format('h:mm a')}
            </Typography>
          </Stack>
        </Stack>
        <IconifyIcon
          icon="material-symbols:keyboard-arrow-down"
          sx={({ transitions }) => ({
            fontSize: 18,
            color: 'text.primary',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: transitions.create('transform', {
              duration: transitions.duration.short,
              easing: transitions.easing.easeInOut,
            }),
          })}
        />
      </Stack>
      <Collapse
        in={open}
        sx={{
          [`& .${collapseClasses.wrapperInner}`]: {
            mt: 2,
          },
        }}
      >
        <CallDetails call={call} />
      </Collapse>
    </Stack>
  );
};
export default CallRecord;
