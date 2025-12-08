import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const segmentsAvatar = {
  Photos: {
    icon: 'material-symbols:imagesmode-outline',
    color: 'info',
  },
  Videos: {
    icon: 'material-symbols:video-file-outline-rounded',
    color: 'primary',
  },
  Document: {
    icon: 'material-symbols:description-outline-rounded',
    color: 'warning',
  },
  Email: {
    icon: 'material-symbols:mail-outline-rounded',
    color: 'success',
  },
  Chats: {
    icon: 'material-symbols:chat-outline-rounded',
    color: 'error',
  },
  Others: {
    icon: 'material-symbols:article-outline-rounded',
    color: 'neutral',
  },
};

const StorageSegmentList = ({ data }) => {
  return (
    <List disablePadding>
      {data.map((segment) => {
        const avatarDetails = segmentsAvatar[segment.title] || {
          icon: 'material-symbols:article-outline-rounded',
          color: 'default',
        };

        return (
          <ListItem
            key={segment.title}
            secondaryAction={
              <Typography variant="caption" fontWeight={500}>
                {segment.size} GB
              </Typography>
            }
            sx={{
              px: 0,
              '& .MuiListItemSecondaryAction-root': {
                right: 0,
              },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 48 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: `${avatarDetails.color}.lighter`,
                  borderRadius: 2,
                }}
              >
                <IconifyIcon
                  icon={avatarDetails.icon}
                  sx={{ fontSize: 24, color: `${avatarDetails.color}.main` }}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={segment.title}
              secondary={`${segment.files} files`}
              slotProps={{
                primary: {
                  variant: 'body2',
                  fontWeight: 600,
                  mb: 0.25,
                },
                secondary: {
                  variant: 'caption',
                },
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default StorageSegmentList;
