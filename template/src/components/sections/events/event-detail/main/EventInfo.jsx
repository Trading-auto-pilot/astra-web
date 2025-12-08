import { Avatar, Box, Link, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const EventInfo = ({ eventInfo }) => {
  return (
    <Box
      sx={{
        pt: { xs: 3, md: 5 },
        pb: 5,
      }}
    >
      <Typography variant="h3" sx={{ mb: 2, fontSize: { md: 'h3.fontSize', xs: 'h4.fontSize' } }}>
        {eventInfo.title}
      </Typography>

      <Paper
        background={1}
        sx={{
          p: 3,
          borderRadius: 6,
          outline: 'none',
          display: 'flex',
          flexDirection: { xs: 'column', xl: 'row' },
          rowGap: 3,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {eventInfo.startTime} - {eventInfo.endTime}
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {eventInfo.date}
          </Typography>
          <Stack alignItems="center" spacing={2}>
            <Avatar
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.lighter',
              }}
            >
              <IconifyIcon
                icon="material-symbols:location-on-outline"
                sx={{ fontSize: 20, color: 'primary.dark' }}
              />
            </Avatar>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 400 }}>
              {eventInfo.location}

              {eventInfo.mapLink && (
                <Link
                  variant="subtitle2"
                  href={eventInfo.mapLink}
                  sx={{
                    fontWeight: 600,
                    ml: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Show in map
                </Link>
              )}
            </Typography>
          </Stack>
        </Box>

        <div>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1.5, textAlign: { xs: 'left', xl: 'right' } }}
          >
            Organized by
          </Typography>
          <Stack
            direction={{ xs: 'row', xl: 'column' }}
            spacing={1}
            alignItems={{ xs: 'center', xl: 'flex-end' }}
          >
            <Avatar
              sx={{ bgcolor: 'success.main', width: 48, height: 48 }}
              alt={eventInfo.organizerName}
            >
              {eventInfo.organizerName.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ lineHeight: 1.5 }}>
              {eventInfo.organizerName}
            </Typography>
          </Stack>
        </div>
      </Paper>
    </Box>
  );
};

export default EventInfo;
