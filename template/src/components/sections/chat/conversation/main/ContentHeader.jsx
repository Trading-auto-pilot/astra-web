import {
  Button,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';

const ContentHeader = ({ sx, handleDrawerToggle }) => {
  const { handleChatSidebar, currentConversation } = useChatContext();
  const { down } = useBreakpoints();

  const downSm = down('sm');

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 3, zIndex: 10, ...sx }}>
      <Stack gap={3} justifyContent="space-between" alignItems="center">
        <Stack gap={1} alignItems="center">
          {downSm && (
            <Tooltip title="Conversation list">
              <Button
                shape="circle"
                variant="soft"
                color="neutral"
                onClick={() => handleChatSidebar(true)}
              >
                <IconifyIcon icon="material-symbols:chevron-left-rounded" fontSize={20} />
              </Button>
            </Tooltip>
          )}

          <List dense disablePadding>
            <ListItemButton
              disableTouchRipple
              sx={{ gap: { xs: 1, sm: 2 }, p: 0, '&:hover': { bgcolor: 'transparent' } }}
              onClick={handleDrawerToggle}
            >
              <ListItemAvatar sx={{ minWidth: 0 }}>
                {currentConversation ? (
                  <RecipientAvatar
                    recipients={currentConversation.recipients}
                    avatarStyles={{ width: 36, height: 36 }}
                    badgeStyles={{ width: 13, height: 13, border: 2 }}
                  />
                ) : (
                  <Skeleton variant="circular" width={36} height={36} />
                )}
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      lineClamp: 1,
                      wordBreak: 'break-all',
                    }}
                  >
                    {currentConversation ? (
                      currentConversation.conversationName ||
                      currentConversation.recipients.map(({ name }) => name).join(', ')
                    ) : (
                      <Skeleton variant="text" width={100} />
                    )}
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Stack>

        <Stack direction="row" gap={1}>
          <Tooltip title="Start a voice call">
            <Button variant="soft" color="neutral" shape="circle">
              <IconifyIcon icon="material-symbols:call-outline" fontSize={20} />
            </Button>
          </Tooltip>
          <Tooltip title="Start a video call">
            <Button variant="soft" color="neutral" shape="circle">
              <IconifyIcon icon="material-symbols:videocam-outline-rounded" fontSize={20} />
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ContentHeader;
