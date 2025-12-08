import { useState } from 'react';
import { Button, Grow, Popover, Stack, Tooltip } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import { DELETE_MESSAGE, SET_EMOJI_REACTION } from 'reducers/ChatReducer';
import IconifyIcon from 'components/base/IconifyIcon';

const reactions = ['❤️', '😄', '😮', '😢', '😡', '👍'];

const ActionButtons = ({ message, show }) => {
  const { chatDispatch, currentUser } = useChatContext();
  const [reactionAnchorEl, setReactionAnchorEl] = useState(null);

  const handleRemoveMessage = () => {
    chatDispatch({
      type: DELETE_MESSAGE,
      payload: { messageId: message.id },
    });
  };

  const handleReaction = (emoji, messageId) => {
    chatDispatch({
      type: SET_EMOJI_REACTION,
      payload: {
        emoji: emoji,
        userId: currentUser.id,
        messageId,
      },
    });

    setReactionAnchorEl(null);
  };

  return (
    <Grow in={show}>
      <Stack
        alignItems="center"
        gap={0.5}
        direction={message.type === 'sent' ? 'row' : 'row-reverse'}
      >
        <>
          <Tooltip title="Emoji">
            <Button
              variant="text"
              color="neutral"
              shape="circle"
              size="small"
              onClick={(e) => setReactionAnchorEl(e.currentTarget)}
            >
              <IconifyIcon
                icon="material-symbols:add-reaction-outline-rounded"
                sx={{ fontSize: 18 }}
              />
            </Button>
          </Tooltip>

          <Popover
            open={!!reactionAnchorEl}
            anchorEl={reactionAnchorEl}
            onClose={() => setReactionAnchorEl(null)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  p: 0.5,
                },
              },
            }}
          >
            {reactions.map((emoji) => (
              <Button
                key={emoji}
                variant="text"
                color="neutral"
                size="small"
                shape="circle"
                sx={{ fontSize: 'body1.fontSize' }}
                onClick={() => handleReaction(emoji, message.id)}
              >
                {emoji}
              </Button>
            ))}
          </Popover>
        </>

        <Tooltip title="Reply">
          <Button variant="text" color="neutral" shape="circle" size="small">
            <IconifyIcon icon="material-symbols:reply-rounded" sx={{ fontSize: 18 }} />
          </Button>
        </Tooltip>

        <Tooltip title="Delete">
          <Button
            variant="text"
            color="neutral"
            shape="circle"
            size="small"
            onClick={handleRemoveMessage}
          >
            <IconifyIcon icon="material-symbols:delete-outline-rounded" sx={{ fontSize: 18 }} />
          </Button>
        </Tooltip>
      </Stack>
    </Grow>
  );
};

export default ActionButtons;
