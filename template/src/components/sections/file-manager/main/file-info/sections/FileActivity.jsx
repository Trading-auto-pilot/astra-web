import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent, { timelineContentClasses } from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';

const FileActivity = ({ file }) => {
  return (
    <Paper background={1} sx={{ p: { xs: 3, md: 5 } }}>
      <Stack direction="column" gap={3}>
        <Typography variant="h6">File Activity</Typography>
        <Stack direction="column" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {dayjs(file.modifiedAt).format('D MMM, YYYY')}
          </Typography>
          <Timeline
            sx={{
              p: 0,
              m: 0,
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              [`& .${timelineContentClasses.root}`]: {
                pr: 0,
              },
            }}
          >
            <TimelineItem sx={{ mb: 1 }}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    mt: 0,
                    mb: 1,
                    boxShadow: 'none',
                    border: 0,
                    p: 1,
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <IconifyIcon
                    icon="material-symbols:share-outline"
                    sx={{ fontSize: 16, color: 'primary.dark' }}
                  />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
              </TimelineSeparator>
              <TimelineContent sx={{ pr: 1 }}>
                <Stack direction="column" gap={1}>
                  <Typography variant="subtitle1">You shared this file with</Typography>
                  <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarGroup max={5}>
                      {file.shared.map((share) => (
                        <Avatar
                          key={share.user.id}
                          src={share.user.avatar}
                          sx={{ width: 32, height: 32 }}
                        />
                      ))}
                    </AvatarGroup>
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                      {dayjs(file.modifiedAt).format('h:mm A')}
                    </Typography>
                  </Stack>
                </Stack>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem sx={{ mb: 1, minHeight: 0 }}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    mt: 0,
                    mb: 1,
                    boxShadow: 'none',
                    border: 0,
                    p: 1,
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <IconifyIcon
                    icon="material-symbols:edit-outline"
                    sx={{ fontSize: 16, color: 'primary.dark' }}
                  />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Stack gap={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">You modified this file</Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                    {dayjs(file.modifiedAt).format('h:mm A')}
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Stack>
        <Stack direction="column" gap={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {dayjs(file.createdAt).format('D MMM, YYYY')}
          </Typography>
          <Timeline
            sx={{
              p: 0,
              m: 0,
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
              },
              [`& .${timelineContentClasses.root}`]: {
                pr: 0,
              },
            }}
          >
            <TimelineItem sx={{ mb: 1 }}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    mt: 0,
                    mb: 1,
                    boxShadow: 'none',
                    border: 0,
                    p: 1,
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <IconifyIcon
                    icon="material-symbols:share-outline"
                    sx={{ fontSize: 16, color: 'primary.dark' }}
                  />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Stack direction="column" gap={1}>
                  <Typography variant="subtitle1">You uploaded this file</Typography>
                  <Stack sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {file.name + '.' + file.extension}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 500 }}>
                      {dayjs(file.uploadedAt).format('h:mm A')}
                    </Typography>
                  </Stack>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default FileActivity;
