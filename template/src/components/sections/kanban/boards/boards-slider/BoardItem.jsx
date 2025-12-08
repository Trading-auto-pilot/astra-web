import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Tooltip,
  Typography,
  avatarClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import paths from 'routes/paths';
import BoardItemMenu from './BoardItemMenu';

dayjs.extend(relativeTime);

const BoardItem = ({ board, size }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { image, name, lastViewAt, assignee } = board;

  return (
    <Card
      sx={{
        outline: 'none',
        borderRadius: 4,
        position: 'relative',
        '&:hover': {
          bgcolor: 'background.elevation1',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BoardItemMenu isHovered={isHovered} />

      <CardActionArea href={paths.kanban}>
        <CardMedia
          image={image}
          sx={{
            position: 'relative',
            display: 'inline-block',
            height: 200,
            width: size === 'small' ? 288 : 355,
            borderRadius: 4,
            overflow: 'hidden',

            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1,
              height: 1,
              display: 'inline-block',
              background: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.07))',
            },
          }}
        />

        <CardContent sx={{ pb: '16px !important' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {name}
          </Typography>
          <Typography
            component="p"
            variant="caption"
            sx={{ color: 'text.disabled', fontWeight: 500, mb: 1 }}
          >
            {lastViewAt}
          </Typography>
          <AvatarGroup
            max={3}
            color="primary"
            sx={{
              justifyContent: 'flex-end',
              [`& .${avatarClasses.root}`]: {
                width: size === 'small' ? 24 : 32,
                height: size === 'small' ? 24 : 32,
                fontWeight: 600,
                fontSize: 12,
                bgcolor: 'primary.main',
              },
            }}
          >
            {assignee.map((user) => (
              <Tooltip title={user.name} key={user.name}>
                <Avatar alt={user.name} src={user.avatar} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BoardItem;
