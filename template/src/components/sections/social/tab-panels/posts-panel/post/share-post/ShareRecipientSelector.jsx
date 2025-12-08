import {
  Avatar,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';
import StyledTextField from 'components/styled/StyledTextField';

const ShareRecipientSelector = ({ shareOption }) => {
  return (
    <Stack direction="column" gap={2} mb={3}>
      <StyledTextField
        fullWidth
        placeholder={shareOption === 'email' ? 'Enter email address' : 'Enter name or group'}
        type={shareOption === 'email' ? 'email' : 'text'}
        variant="filled"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                {shareOption === 'email' ? (
                  <IconifyIcon icon="material-symbols:mail-outline-rounded" />
                ) : (
                  <IconifyIcon icon="material-symbols:person-outline-rounded" />
                )}
              </InputAdornment>
            ),
          },
        }}
      />

      <SimpleBar>
        <ToggleButtonGroup
          aria-label="text formatting"
          sx={{ bgcolor: 'transparent', p: 0, gap: 0.5 }}
        >
          {users.slice(0, 5).map((user) => (
            <ToggleButton key={user.id} value="bold" aria-label="bold">
              <Stack
                direction="column"
                gap={0.5}
                sx={{ alignItems: 'center', justifyContent: 'center', p: 1, width: 60, height: 70 }}
              >
                <Avatar src={user.avatar} sx={{ height: 32, width: 32 }} />
                <Typography variant="caption" fontWeight={500} color="text.secondary">
                  {user.name}
                </Typography>
              </Stack>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </SimpleBar>
    </Stack>
  );
};

export default ShareRecipientSelector;
