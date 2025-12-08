import { Avatar, Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';

const Customer = () => {
  return (
    <Box
      sx={{
        width: 1,
        p: { xs: 3, md: 5 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Customer
      </Typography>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Avatar src={users[0].avatar} alt="Captain Haddock" sx={{ width: 54, height: 54, mb: 1 }} />
      </Box>
      <Stack direction="column" spacing={2}>
        <TextField
          fullWidth
          id="customerName"
          type="text"
          label="User"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="material-symbols:person-outline-rounded" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="column" spacing={1}>
          <TextField
            fullWidth
            id="customerEmail"
            type="email"
            label="Email"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:mail-outline-rounded" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            id="customerPhone"
            type="tel"
            label="Phone Number"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon icon="material-symbols:call-outline" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& input': { direction: 'ltr' } }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Customer;
