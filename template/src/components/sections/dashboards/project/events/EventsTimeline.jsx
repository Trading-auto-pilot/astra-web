import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Paper,
  Stack,
  Tooltip,
  Typography,
  avatarClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IconifyIcon from 'components/base/IconifyIcon';

dayjs.extend(customParseFormat);

const EventsTimeline = ({ events, handleDrawerClose }) => {
  return (
    <Paper background={1} sx={{ outline: 'none', height: 1 }}>
      <Box
        sx={{
          height: 1,
          px: 5,
          maxHeight: { md: 530 },
          overflow: 'auto',
          py: 3,
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2, display: { md: 'none' } }}
        >
          <Typography variant="h6">Timeline</Typography>
          <Button shape="circle" variant="soft" color="neutral" onClick={handleDrawerClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Stack>
        <Timeline
          sx={{
            p: 0,
            m: 0,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {events.map((event, index) => (
            <TimelineItem key={event.id}>
              <TimelineSeparator>
                <TimelineDot color={event.color} sx={{ my: 1.25 }} />
                {index !== events.length - 1 && (
                  <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
                )}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {`${dayjs(event.startDate).format('MMM D')} ${event.endDate ? `- ${dayjs(event.endDate).format('D')}` : ''}`}
                </Typography>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={[events.length - 1 !== index && { mb: 2 }]}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {event.title}
                  </Typography>
                  <AvatarGroup
                    max={5}
                    color="primary"
                    sx={{
                      display: 'inline-flex',
                      mr: 'auto',
                      [`& .${avatarClasses.root}`]: {
                        width: 20,
                        height: 20,
                        fontSize: 10,
                        fontWeight: 'medium',
                        backgroundColor: 'primary.main',
                      },
                    }}
                  >
                    {event.members.map((member) => (
                      <Tooltip title={member.name} key={member.name}>
                        <Avatar alt={member.name} src={member.avatar} />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </Paper>
  );
};

export default EventsTimeline;
