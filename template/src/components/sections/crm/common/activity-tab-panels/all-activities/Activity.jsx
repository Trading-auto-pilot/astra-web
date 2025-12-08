import { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import CRMDropdownMenu from '../../CRMDropdownMenu';

const Activity = ({ activity }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Stack
      sx={{
        bgcolor: 'background.elevation1',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        borderRadius: 4,
        p: 2,
        gap: 1,
      }}
    >
      <Stack gap={2} flexGrow={1}>
        <Stack
          sx={{
            bgcolor: (theme) => cssVarRgba(theme.vars.palette[activity.color].mainChannel, 0.15),
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            p: 0.5,
            flexShrink: 0,
          }}
        >
          <IconifyIcon
            icon={activity.icon}
            sx={{
              fontSize: 24,
              color:
                activity.color === 'success' || activity.color === 'warning'
                  ? `${activity.color}.dark`
                  : `${activity.color}.main`,
            }}
          />
        </Stack>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1}
          flexGrow={1}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="column" gap={0.5}>
            <Typography variant="subtitle2">
              <strong>{activity.title}</strong> <Link href="#!">{activity.assignment}</Link>
            </Typography>

            <Typography variant="body2">
              {activity.type === 'mail' ? 'Sent by' : 'By'} <Link href="#!">{activity.user}</Link>
            </Typography>
          </Stack>
          <Stack gap={0.5} sx={{ py: 0.75 }}>
            <IconifyIcon
              icon="material-symbols:schedule-outline"
              sx={{ fontSize: 16, color: 'primary.main' }}
            />
            <Typography variant="caption" sx={{ lineHeight: '18px', textWrap: 'nowrap' }}>
              {dayjs(activity.timeStamp).format('h:mm a')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack gap={{ xs: 1, sm: 1.5 }} sx={{ alignItems: 'center' }}>
        <div>
          <Button
            size="small"
            shape="square"
            color="neutral"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 18 }} />
          </Button>
          <CRMDropdownMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            handleClose={() => setAnchorEl(null)}
          />
        </div>
      </Stack>
    </Stack>
  );
};

export default Activity;
