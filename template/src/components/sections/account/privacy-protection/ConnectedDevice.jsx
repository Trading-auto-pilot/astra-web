import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import InfoCard from '../common/InfoCard';
import SecurityKeyEditFormDialog from './SecurityKeyEditFormDialog';

const ConnectedDevice = ({ connectedDevice }) => {
  const { deviceName, connected, used, currentlyUsed, lastUsedDate, deviceIcon } = connectedDevice;

  const [open, setOpen] = useState(false);

  return (
    <>
      <InfoCard setOpen={setOpen} sx={{ p: 3 }}>
        <Stack spacing={2} flexGrow={1}>
          <IconifyIcon icon={deviceIcon} sx={{ fontSize: 40 }} />
          <Stack direction="column" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {deviceName}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, color: 'text.secondary', mb: 1 }}
            >
              {connected ? 'Connected' : 'Not connected'}
            </Typography>
            <Typography variant="body2">
              {used
                ? currentlyUsed
                  ? 'Currently Used'
                  : `Last used at ${dayjs(lastUsedDate).format('MMM DD, h:mm a')}`
                : 'Not yet Used'}
            </Typography>
          </Stack>
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <SecurityKeyEditFormDialog
        open={open}
        handleDialogClose={() => setOpen(false)}
        device={connectedDevice}
      />
    </>
  );
};

export default ConnectedDevice;
