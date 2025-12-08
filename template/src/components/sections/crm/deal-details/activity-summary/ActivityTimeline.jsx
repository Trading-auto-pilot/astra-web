import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const ActivityTimeline = ({ timeline }) => {
  return (
    <Timeline
      sx={{
        p: 0,
        m: 0,
      }}
    >
      {timeline.map((item, index) => (
        <TimelineItem key={item.id} sx={{ '&:before': { flex: 0, padding: 0 } }}>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index < timeline.length - 1 && (
              <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
            )}
          </TimelineSeparator>
          <TimelineContent sx={{ mt: 0.25 }}>
            <Stack direction="column" gap={1}>
              <Stack sx={{ justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                  {item.date}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.description}
              </Typography>
            </Stack>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
