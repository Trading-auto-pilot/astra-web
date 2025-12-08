import {
  Avatar,
  AvatarGroup,
  Box,
  LinearProgress,
  Rating,
  Stack,
  Typography,
  avatarGroupClasses,
} from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';

const ratings = [
  { stars: 5, reviews: { count: 130, users: users.slice(0, 10) } },
  { stars: 4, reviews: { count: 50, users: users.slice(3, 9) } },
  { stars: 3, reviews: { count: 14, users: users.slice(5, 9) } },
  { stars: 2, reviews: { count: 4, users: users.slice(10, 13) } },
  { stars: 1, reviews: { count: 2, users: users.slice(13, 15) } },
];

const totalReviews = ratings.reduce((sum, rating) => sum + rating.reviews.count, 0);

const getRatingText = (stars) => {
  switch (stars) {
    case 5:
      return 'Very Good';
    case 4:
      return 'Good';
    case 3:
      return 'Neutral';
    case 2:
      return 'Poor';
    case 1:
      return 'Very Poor';
    default:
      return 'Invalid Rating';
  }
};

const OverRating = () => {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="body1" fontWeight={700} mb={2}>
        Over Rating
      </Typography>

      <Stack direction="column" gap={1}>
        {ratings.map((rating) => {
          return (
            <Stack
              key={rating.stars}
              sx={{
                gap: 2,
                justifyContent: 'space-between',
                bgcolor: 'background.elevation1',
                px: 2,
                py: 1,
                borderRadius: 2,
                flexWrap: 'wrap',
              }}
            >
              <Stack gap={2} alignItems="center">
                <Typography variant="body2" fontWeight={600} width={80} color="textSecondary">
                  {getRatingText(rating.stars)}
                </Typography>

                <Rating
                  name="product-rating"
                  color="warning"
                  value={rating.stars}
                  readOnly
                  icon={
                    <IconifyIcon
                      icon="material-symbols:star-rounded"
                      fontSize={24}
                      color="warning.main"
                    />
                  }
                  emptyIcon={
                    <IconifyIcon
                      icon="material-symbols:star-rounded"
                      fontSize={24}
                      color="divider"
                    />
                  }
                />
              </Stack>

              <Stack
                sx={{
                  gap: 2,
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Stack
                  justifyContent={{ sm: 'center', md: 'flex-start', lg: 'center' }}
                  alignItems="center"
                  flex={1}
                >
                  <Typography variant="body2" fontWeight={600} width={40} color="textSecondary">
                    {((rating.reviews.count / totalReviews) * 100).toFixed(0)}%
                  </Typography>

                  <Box sx={{ flex: 1, maxWidth: 290, minWidth: 80 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Number(((rating.reviews.count / totalReviews) * 100).toFixed(0))}
                      sx={{ height: 8 }}
                    />
                  </Box>
                </Stack>

                <AvatarGroup
                  max={4}
                  sx={{
                    width: 80,
                    [`& .${avatarGroupClasses.avatar}`]: {
                      width: 24,
                      height: 24,
                      fontSize: 10,
                    },
                  }}
                >
                  {rating.reviews.users.map((user) => (
                    <Avatar key={user.id} src={user.avatar} sx={{ width: 24, height: 24 }} />
                  ))}
                </AvatarGroup>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default OverRating;
