import {
  Avatar,
  AvatarGroup,
  Box,
  Paper,
  Rating,
  Stack,
  Typography,
  avatarGroupClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';

const AverageRating = () => {
  return (
    <Paper
      background={1}
      sx={{ p: 2, borderRadius: 6, outline: 'none', width: { xs: 1, xl: 240 } }}
    >
      <Stack
        sx={{
          height: 1,
          flexDirection: 'column',
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ p: 3, borderRadius: 4, bgcolor: 'background.elevation2', textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Average Rating
          </Typography>

          <Rating
            name="product-rating"
            color="warning"
            value={4}
            readOnly
            icon={
              <IconifyIcon
                icon="material-symbols:star-rounded"
                fontSize={30}
                color="warning.main"
              />
            }
            emptyIcon={
              <IconifyIcon icon="material-symbols:star-rounded" fontSize={30} color="divider" />
            }
          />
        </Box>

        <Stack
          gap={2}
          justifyContent="space-between"
          direction={{ xs: 'row', xl: 'column' }}
          flexWrap="wrap"
        >
          <div>
            <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
              Submitted By
            </Typography>

            <Typography variant="caption" component="p" sx={{ color: 'text.disabled' }}>
              <Box component="strong">5</Box> Interviewers submitted &nbsp;&nbsp;
              <Box component="strong">1</Box> left
            </Typography>
          </div>

          <AvatarGroup
            max={5}
            sx={{
              justifyContent: 'flex-end',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 32,
                height: 32,
                fontSize: 10,
              },
            }}
          >
            {users.slice(0, 6).map((user) => (
              <Avatar key={user.id} src={user.avatar} sx={{ width: 32, height: 32 }} />
            ))}
          </AvatarGroup>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AverageRating;
