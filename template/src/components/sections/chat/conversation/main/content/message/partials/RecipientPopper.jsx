import { useNavigate } from 'react-router';
import { Button, Grow, Paper, Popper, Stack, Typography } from '@mui/material';
import { generateUniqueId } from 'lib/utils';
import { useChatContext } from 'providers/ChatProvider';
import { START_NEW_CONVERSATION } from 'reducers/ChatReducer';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';

const RecipientPopper = ({ data, handleClose, anchorEl, messageType }) => {
  const { chatDispatch, conversations } = useChatContext();
  const navigate = useNavigate();

  const handleRecipientMessage = (recipient) => {
    handleClose();

    const existingConversation = conversations.find(
      (conversation) =>
        conversation.recipients.length === 1 && conversation.recipients[0].id === recipient.id,
    );

    if (existingConversation) {
      navigate(paths.chatConversation(existingConversation.id));
    } else {
      const newConversationId = generateUniqueId();

      chatDispatch({
        type: START_NEW_CONVERSATION,
        payload: { conversationId: newConversationId, recipients: [recipient] },
      });
      navigate(paths.chatConversation(newConversationId));
    }
  };

  if (!data) return null;

  return (
    <Popper
      open={!!anchorEl}
      anchorEl={anchorEl}
      placement={messageType === 'sent' ? 'bottom-end' : 'bottom-start'}
      transition
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
      sx={{
        width: 280,
      }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={350}>
          <Paper
            variant="elevation"
            elevation={2}
            sx={{
              p: 2,
              backgroundImage: 'none',
              bgcolor: (theme) => theme.vars.palette.background.menu,
              flexDirection: 'column',
            }}
          >
            <Stack gap={1} alignItems="center" mb={3}>
              <RecipientAvatar
                recipients={data}
                avatarStyles={{ width: 48, height: 48 }}
                badgeStyles={{ width: 16, height: 16, border: 3 }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.primary',
                  lineClamp: 1,
                }}
              >
                {data.name}
              </Typography>
            </Stack>

            <Button
              variant="soft"
              color="neutral"
              onClick={() => handleRecipientMessage(data)}
              fullWidth
              startIcon={
                <IconifyIcon
                  icon="material-symbols:chat-bubble-outline-rounded"
                  sx={{ fontSize: '20px !important' }}
                />
              }
            >
              Message
            </Button>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default RecipientPopper;
