import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';

const ProfileActions = () => {
  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Button
        color="primary"
        variant="soft"
        startIcon={<IconifyIcon icon="material-symbols:person-add-outline" />}
      >
        Follow
      </Button>
      <Button
        color="neutral"
        variant="soft"
        startIcon={<IconifyIcon icon="material-symbols:chat-outline" />}
      >
        Message
      </Button>
      <DashboardMenu
        size="medium"
        variant="soft"
        menuItems={[
          { label: 'Status' },
          { label: 'Archive' },
          { label: 'Delete', sx: { color: 'error.main' } },
        ]}
      />
    </Stack>
  );
};

export default ProfileActions;
