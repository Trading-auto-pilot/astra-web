import { useState } from 'react';
import { ButtonBase } from '@mui/material';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import MembersDialog from './MembersDialog';

const BoardMembers = ({ members, assigneeType, sx }) => {
  const { up } = useBreakpoints();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const upMd = up('md');

  return (
    <>
      <AvatarGroup
        component={ButtonBase}
        disableRipple
        onClick={() => setIsDialogOpen(true)}
        max={assigneeType === 'board' ? (upMd ? 5 : 3) : 5}
        sx={{
          mr: 1,
          display: 'inline-flex',
          [`& .${avatarClasses.root}`]: {
            width: assigneeType === 'board' ? { xs: 24, md: 32 } : 32,
            height: assigneeType === 'board' ? { xs: 24, md: 32 } : 32,
            fontSize: 'caption.fontSize',
            fontWeight: 'medium',
            bgcolor: 'primary.main',
          },
          ...sx,
        }}
      >
        {members.map((user) => (
          <Tooltip key={user.name} title={user.name}>
            <Avatar alt={user.name} src={user.avatar} />
          </Tooltip>
        ))}
      </AvatarGroup>

      <MembersDialog
        members={members}
        open={isDialogOpen}
        handleClose={() => {
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};

export default BoardMembers;
