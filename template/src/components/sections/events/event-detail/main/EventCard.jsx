import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const EventCard = ({ event, sx }) => {
  const { title, image, priceRange, date, time, location } = event;

  return (
    <Link href="#!">
      <Card sx={{ outline: 'none', bgcolor: 'background.elevation1', ...sx }}>
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover', height: 200, borderRadius: 6 }}
        />
        <CardContent sx={{ p: 3 }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {priceRange}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </Typography>

            <Stack alignItems="flex-end" justifyContent="space-between">
              <div>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1 }}>
                    {date}
                  </Typography>
                  <Typography variant="subtitle2" color="warning.main">
                    {time}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <IconifyIcon
                    icon="material-symbols:location-on-outline"
                    fontSize={20}
                    color="primary.dark"
                  />
                  {location}
                </Typography>
              </div>
              <IconButton edge="start" aria-label="favourite">
                <IconifyIcon
                  icon="material-symbols:favorite-outline-rounded"
                  width={20}
                  height={20}
                />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
