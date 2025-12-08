import { useState } from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import InfoCard from '../common/InfoCard';
import DeviceDialog from './DeviceDialog';

const LoggedDevice = ({ loggedinDevice }) => {
  const { name, icon, location, currentlyLoggedIn, lastLoggedTime } = loggedinDevice;
  const { up, down } = useBreakpoints();

  const [open, setOpen] = useState(false);

  const upSm = up('sm');
  const downSm = down('sm');

  return (
    <>
      <InfoCard setOpen={setOpen} sx={{ p: 3 }}>
        <Stack spacing={2} flexGrow={1}>
          <Image src={icon} alt="" width="auto" height={40} />
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, color: 'text.secondary', mb: 1 }}
            >
              {location}
            </Typography>
            {downSm && currentlyLoggedIn && (
              <Chip label="Currently logged in" color="info" sx={{ mb: 1 }} />
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
              {currentlyLoggedIn
                ? `Today at ${dayjs(lastLoggedTime).format('h:mm a')}`
                : `Last logged in at ${dayjs(lastLoggedTime).format('MMM DD, h:mm a')}`}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={1} alignItems="center">
          {upSm && currentlyLoggedIn && <Chip label="Currently logged in" color="info" />}

          <IconifyIcon
            icon="material-symbols:arrow-forward-ios"
            sx={{ fontSize: 20, color: 'neutral.dark' }}
          />
        </Stack>
      </InfoCard>
      <DeviceDialog
        open={open}
        handleDialogClose={() => setOpen(false)}
        loggedInDevice={loggedinDevice}
      />
    </>
  );
};

export default LoggedDevice;
