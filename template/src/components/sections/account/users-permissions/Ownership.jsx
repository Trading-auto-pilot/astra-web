import { Button, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import StatusAvatar from 'components/base/StatusAvatar';

const Ownership = ({ name, email, avatar, lastLoginAt }) => {
  return (
    <Stack direction="column" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <div>
        <Stack direction="column" spacing={1} sx={{ mb: 1, alignItems: 'flex-start' }}>
          <StatusAvatar
            alt="Tsamina Mina"
            status="online"
            src={avatar}
            sx={{ width: 64, height: 64 }}
          />
          <div>
            <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: '31.5px' }}>
              {name}
            </Typography>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
              {email}
            </Typography>
          </div>
        </Stack>
        <Typography
          variant="body2"
          color="info"
          sx={{ fontWeight: 500, display: 'flex', gap: 1, alignItems: 'center' }}
        >
          <IconifyIcon icon="material-symbols:info-outline" sx={{ fontSize: 24 }} />
          Last login was {dayjs(lastLoginAt).format('dddd, DD MMMM YYYY, h:mm A')} GMT
        </Typography>
      </div>
      <Button
        variant="soft"
        color="neutral"
        endIcon={
          <IconifyIcon icon="material-symbols:chevron-right-rounded" sx={{ fontSize: 20 }} />
        }
      >
        Change ownership
      </Button>
    </Stack>
  );
};

export default Ownership;
