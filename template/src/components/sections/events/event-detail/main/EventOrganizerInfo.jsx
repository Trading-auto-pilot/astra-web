import { Avatar, Button, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';

const EventOrganizerInfo = ({ organizer }) => {
  const { numberFormat } = useNumberFormat();

  return (
    <Paper
      background={1}
      component={Stack}
      sx={{
        outline: 'none',
        flexDirection: 'column',
        gap: 3,
        borderRadius: 6,
        p: 3,
        height: 1,
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="column" gap={3}>
        <Typography variant="h6" sx={{ lineHeight: 1.5 }}>
          Organizer
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row', xl: 'column' }} rowGap={3} columnGap={4}>
          <Stack alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
              {organizer.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {organizer.name}
              </Typography>
              <Typography component="p" variant="caption" color="text.secondary">
                {numberFormat(organizer.followers, {
                  notation: 'compact',
                  compactDisplay: 'short',
                })}
                &nbsp; followers
              </Typography>
            </div>
          </Stack>

          <Divider
            flexItem
            orientation="vertical"
            sx={{ display: { xs: 'none', sm: 'block', xl: 'none' } }}
          />

          <div>
            <Stack gap={1} alignItems="center" mb={1}>
              <Avatar sx={{ bgcolor: 'background.elevation2', width: 24, height: 24 }}>
                <IconifyIcon
                  icon="material-symbols:call-outline-rounded"
                  fontSize={16}
                  color="text.secondary"
                />
              </Avatar>
              <Link href={`tel:${organizer.phone}`} variant="caption" color="text.secondary">
                {organizer.phone}
              </Link>
            </Stack>

            <Stack gap={1} alignItems="center">
              <Avatar sx={{ bgcolor: 'background.elevation2', width: 24, height: 24 }}>
                <IconifyIcon
                  icon="material-symbols:mail-outline-rounded"
                  fontSize={16}
                  color="text.secondary"
                />
              </Avatar>
              <Link href={`mailto:${organizer.email}`} variant="caption" color="text.secondary">
                {organizer.email}
              </Link>
            </Stack>
          </div>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {organizer.description}
        </Typography>
      </Stack>

      <Button variant="contained" color="neutral" sx={{ alignSelf: 'flex-start' }}>
        Follow
      </Button>
    </Paper>
  );
};

export default EventOrganizerInfo;
