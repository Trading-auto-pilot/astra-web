import { Button, Paper, Stack, Tooltip } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import { TOGGLE_STARRED_CONVERSATION } from 'reducers/ChatReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const AsideHeader = ({ handleClose }) => {
  const { currentConversation, chatDispatch } = useChatContext();

  const handleToggleStarred = () => {
    if (currentConversation) {
      chatDispatch({ type: TOGGLE_STARRED_CONVERSATION });
    }
  };

  return (
    <Paper
      background={1}
      sx={{
        zIndex: 1,
        px: { xs: 3, md: 5 },
        py: 3,
      }}
    >
      <Stack justifyContent="space-between" alignItems="center">
        <Stack gap={1}>
          <Button
            variant="soft"
            color={currentConversation?.starred ? 'warning' : 'neutral'}
            startIcon={
              <IconifyIcon
                icon="material-symbols:star-rate-rounded"
                sx={{ fontSize: '20px !important' }}
              />
            }
            onClick={handleToggleStarred}
          >
            Starred
          </Button>
          <Button
            variant="soft"
            color="neutral"
            startIcon={
              <IconifyIcon
                icon="material-symbols:notifications-outline-rounded"
                sx={{ fontSize: '20px !important' }}
              />
            }
          >
            Mute
          </Button>
        </Stack>

        <Tooltip title="Close">
          <Button shape="circle" variant="soft" color="neutral" onClick={handleClose}>
            <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default AsideHeader;
