import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const ActivityItem = ({ data, isLastItem }) => {
  return (
    <TimelineItem sx={{ mb: 1, minHeight: 'unset' }}>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            p: 1,
            mt: 0,
            mb: 1,
            border: 0,
            boxShadow: 'none',
            bgcolor: 'primary.lighter',
          }}
        >
          <IconifyIcon icon={data.icon} sx={{ fontSize: 16, color: 'primary.dark' }} />
        </TimelineDot>
        {!isLastItem && <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />}
      </TimelineSeparator>
      <TimelineContent sx={{ p: 0, pl: 2, pb: !isLastItem ? 2 : 0 }}>
        <Stack sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Typography
              variant="body1"
              sx={{ pb: data.description || data.avatars ? 1 : 0, fontWeight: 500 }}
            >
              {data.title}
            </Typography>
            {data.avatars && (
              <AvatarGroup
                max={5}
                color="primary"
                sx={{
                  mr: 'auto',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  [`& .${avatarClasses.root}`]: {
                    width: 32,
                    height: 32,
                    fontWeight: 'medium',
                    fontSize: 'body2.fontSize',
                    bgcolor: 'primary.main',
                  },
                }}
              >
                {data.avatars.map((avatar) => (
                  <Tooltip title={avatar.name} key={avatar.name}>
                    <Avatar alt={avatar.name} src={avatar.avatar} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
            {data.description && (
              <Typography variant="body2" sx={{ color: 'text.secondary', lineClamp: 2 }}>
                {data.description}
              </Typography>
            )}
          </div>
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 'medium',
              color: 'text.disabled',
              flexShrink: 0,
            }}
          >
            {data.time}
          </Typography>
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
};

export default ActivityItem;
