import { useState } from 'react';
import { selectClasses } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { users } from 'data/users';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const HeaderActions = ({ calendarRef, currentDate }) => {
  const [selectedUser, setSelectedUser] = useState(users[0]);

  return (
    <Stack
      sx={{
        gap: 1,
        width: { xs: 1, lg: '45%', xl: 1 },
        alignItems: { xs: 'center', lg: 'flex-end', xl: 'center' },
        justifyContent: { xs: 'space-between', sm: 'flex-end' },
        flexWrap: { lg: 'wrap-reverse' },
      }}
    >
      <Stack sx={{ width: 160, alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          shape="square"
          color="neutral"
          onClick={() => calendarRef.current?.goToPreviousMonth()}
        >
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:chevron-left-rounded"
            sx={{ fontSize: 20 }}
          />
        </Button>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textWrap: 'nowrap',
            textAlign: 'center',
            minWidth: 75,
          }}
        >
          {dayjs(currentDate).format('MMM, YYYY')}
        </Typography>
        <Button shape="square" color="neutral" onClick={() => calendarRef.current?.goToNextMonth()}>
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:chevron-right-rounded"
            sx={{ fontSize: 20 }}
          />
        </Button>
      </Stack>

      <StyledTextField
        value={selectedUser.name}
        slotProps={{
          select: {
            MenuProps: {
              disableAutoFocusItem: true,
              disableEnforceFocus: true,
              slotProps: {
                paper: {
                  sx: {
                    maxHeight: 350,
                    overflowY: 'auto',
                  },
                },
              },
            },
          },
        }}
        onChange={(e) => {
          const user = users.find((user) => user.name === e.target.value);
          if (user) setSelectedUser(user);
        }}
        sx={{
          width: 1,
          maxWidth: { xs: 180, sm: 164, lg: 180, xl: 200 },
          [`& .${selectClasses.select}`]: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          },
        }}
        select
      >
        {users.map((user) => (
          <MenuItem key={user.name} value={user.name} sx={{ gap: 1 }}>
            <Avatar src={user.avatar} sx={{ width: 20, height: 20 }} />
            <Typography
              variant="body2"
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'block',
                width: 1,
              }}
            >
              {user.name}
            </Typography>
          </MenuItem>
        ))}
      </StyledTextField>
    </Stack>
  );
};

export default HeaderActions;
