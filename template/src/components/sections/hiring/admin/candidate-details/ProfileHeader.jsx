import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Typography,
  selectClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import StyledSelect from 'components/styled/StyledSelect';

const ProfileHeader = () => {
  return (
    <Paper sx={{ px: { xs: 3, lg: 5 }, py: 3 }}>
      <PageBreadcrumb
        items={[
          {
            label: 'Home',
            url: '/',
          },
          {
            label: 'Candidate Details',
            url: '#!',
            active: true,
          },
        ]}
        sx={{ mb: 2 }}
      />

      <Stack
        sx={{
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          rowGap: 3,
          columnGap: 2,
        }}
      >
        <Stack
          sx={{
            flexDirection: { sm: 'column' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Stack gap={2} sx={{ alignItems: 'center' }}>
            <Avatar
              alt={users[15].name}
              src={users[15].avatar}
              sx={{ width: 80, height: 80, borderRadius: '50%' }}
            />

            <div>
              <Typography variant="h5" sx={{ typography: { xs: 'h6', md: 'h5' } }}>
                {users[15].name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Applied{' '}
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Jan 5, 2026
                </Box>
              </Typography>
            </div>
          </Stack>

          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Button shape="circle" variant="soft" color="neutral">
              <IconifyIcon icon="material-symbols:arrow-back-rounded" fontSize={20} />
            </Button>

            <Button shape="circle" variant="soft" color="neutral">
              <IconifyIcon icon="material-symbols:arrow-forward-rounded" fontSize={20} />
            </Button>
          </Stack>
        </Stack>

        <Stack
          sx={{
            gap: { xs: 2, sm: 4 },
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: { sm: 'flex-end' },
          }}
        >
          <Stack gap={1} alignItems="center">
            <StyledSelect
              variant="filled"
              defaultValue="Member"
              MenuProps={{
                slotProps: {
                  list: {
                    dense: true,
                  },
                },
              }}
              sx={{
                minWidth: { xs: 200, sm: 140, md: 180 },
                [`& .${selectClasses.icon}`]: { right: 8 },
              }}
            >
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Guest">Guest</MenuItem>
            </StyledSelect>

            <Button variant="soft" color="neutral">
              Disqualified
            </Button>
          </Stack>

          <Box sx={{ textAlign: { sm: 'right' } }}>
            <Typography variant="subtitle1" color="textSecondary" mb={1}>
              Job Opeing{' '}
              <Box component="strong" whiteSpace="nowrap">
                February 24, 2024
              </Box>{' '}
              for{' '}
              <Box component="strong" whiteSpace="nowrap">
                Sr. Desinger
              </Box>
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              <strong>100 Candidates</strong> Applied
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProfileHeader;
