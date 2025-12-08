import { useState } from 'react';
import { Button, buttonClasses } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import InviteMemberDialog from './InviteMemberDialog';

const InviteButton = () => {
  const { up } = useBreakpoints();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const upLg = up('lg');

  return (
    <>
      <Button
        variant="soft"
        size="medium"
        color="neutral"
        shape={upLg ? undefined : 'square'}
        onClick={() => setIsDialogOpen(true)}
        startIcon={
          <IconifyIcon
            icon="material-symbols:group-add-outline"
            sx={{ fontSize: '18px !important' }}
          />
        }
        sx={[
          { flexShrink: 0 },
          !upLg && {
            [`& .${buttonClasses.startIcon}`]: {
              m: 0,
            },
          },
        ]}
      >
        {upLg && 'Invite'}
      </Button>

      <InviteMemberDialog open={isDialogOpen} handleClose={() => setIsDialogOpen(false)} />
    </>
  );
};

export default InviteButton;
