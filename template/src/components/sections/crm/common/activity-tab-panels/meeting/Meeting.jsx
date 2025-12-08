import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

const Meeting = ({ date, meeting, isToday }) => {
  return (
    <Stack
      gap={2}
      sx={{ alignItems: 'flex-start', bgcolor: 'background.elevation1', p: 2, borderRadius: 6 }}
    >
      <Box sx={{ borderRadius: 2, minWidth: 65, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', textAlign: 'center', color: 'common.white', py: 0.25 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {dayjs(date).format('MMM')}
          </Typography>
        </Box>
        <Stack
          direction="column"
          sx={{ alignItems: 'center', bgcolor: 'background.default', pt: 0.5, pb: 1 }}
        >
          <Typography variant="h5" sx={{ color: 'text.secondary' }}>
            {dayjs(date).format('D')}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {dayjs(date).format('ddd')}
          </Typography>
        </Stack>
      </Box>
      <Stack direction="column" gap={{ xs: 2, sm: 0 }} sx={{ flexGrow: 1 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          gap={1}
          sx={{
            py: { sm: 2 },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="column" gap={1}>
            <Typography variant="subtitle1">
              Meeting at{' '}
              <Box component="span" sx={{ fontWeight: 500 }}>
                {dayjs(meeting.scheduledDate).format('h:mm a')}
              </Box>{' '}
              with{' '}
              <Box component="span" sx={{ fontWeight: 500 }}>
                {meeting.participant}
              </Box>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: '18px' }}>
              Scheduled by{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {meeting.scheduledBy}
              </Box>{' '}
              at {dayjs(meeting.scheduledDate).format('DD MMM, YYYY h:mm a')}
            </Typography>
          </Stack>
          <AvatarGroup
            max={4}
            sx={{
              mx: { sm: 1 },
              [`& .${avatarClasses.root}`]: { width: 32, height: 32, fontSize: 14 },
            }}
          >
            {meeting.guests.map((guest) => (
              <Tooltip key={guest.id} title={guest.name}>
                <Avatar src={guest.avatar} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Stack>
        {isToday && (
          <Button variant="soft" href="#!" sx={{ alignSelf: 'flex-start' }}>
            Join now
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default Meeting;
