import { memo, useMemo } from 'react';
import Avatar, { avatarClasses } from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';

const getLabelChipColor = (val) => {
  switch (val) {
    case 'feature':
      return 'primary';
    case 'issue':
      return 'warning';
    case 'bug':
      return 'error';
    default:
      return 'neutral';
  }
};

const TaskCard = memo(({ task }) => {
  const progressValue = useMemo(() => {
    if (task.progress?.showBar) {
      return (task.progress.completed / task.progress.total) * 100;
    }

    return null;
  }, [task.progress]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        outline: 'none',
        bgcolor: 'background.elevation2',
        '&:hover': { bgcolor: 'background.elevation3' },
      }}
    >
      {task.coverImage && (
        <CardMedia
          component="img"
          image={task.coverImage}
          alt="card-image"
          sx={{
            p: 1,
            height: 214,
            borderRadius: 4,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />
      )}

      <CardContent sx={{ p: 2, pb: (theme) => `${theme.spacing(2)} !important` }}>
        {task.label && (
          <Chip
            label={task.label}
            variant="soft"
            size="small"
            color={getLabelChipColor(task.label)}
            sx={{ mb: 2, textTransform: 'capitalize' }}
          />
        )}

        {progressValue && (
          <LinearProgress
            variant="determinate"
            color={progressValue === 100 ? 'success' : 'primary'}
            value={progressValue}
            sx={{ mb: 2 }}
          />
        )}

        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
          {task.title}
        </Typography>

        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          {task.dueDate && (
            <Chip
              icon={<IconifyIcon icon="material-symbols:timer-outline-rounded" />}
              label={dayjs(task.dueDate).format('D MMM')}
              variant="soft"
              color="info"
            />
          )}

          {task.progress?.showData && (
            <Stack sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <IconifyIcon
                icon={'material-symbols-light:check-box-outline'}
                sx={{ fontSize: '18px !important' }}
              />
              <Typography
                variant="caption"
                sx={{ fontWeight: 500 }}
              >{`${task.progress.completed}/${task.progress.total}`}</Typography>
            </Stack>
          )}

          {task.attachmentCount && (
            <Stack sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <IconifyIcon
                icon={'material-symbols-light:attachment-rounded'}
                sx={{ fontSize: '18px !important' }}
              />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {task.attachmentCount}
              </Typography>
            </Stack>
          )}

          <AvatarGroup
            max={3}
            color="primary"
            sx={{
              ml: 'auto',
              mr: 1,
              [`& .${avatarClasses.root}`]: {
                width: 24,
                height: 24,
                fontWeight: 'medium',
                bgcolor: 'primary.main',
              },
            }}
          >
            {task.assignee?.map((user) => (
              <Tooltip title={user.name} key={user.name}>
                <Avatar alt={user.name} src={user.avatar} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
});

export default TaskCard;
