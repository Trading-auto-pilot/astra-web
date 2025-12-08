import { useMemo, useState } from 'react';
import { ButtonBase, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useChatContext } from 'providers/ChatProvider';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';
import RecipientPopper from './RecipientPopper';

const MessageHeader = ({ message }) => {
  const { currentUser, currentConversation } = useChatContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const messageData = useMemo(() => {
    if (!currentConversation) return null;

    const index = currentConversation.messages.findIndex((m) => m.id === message.id);
    if (index > 0 && message.senderId === currentConversation.messages[index - 1].senderId) {
      return null;
    }

    const isReceived = message.type === 'received';
    const recipient = currentConversation.recipients.find(({ id }) => id === message.senderId);
    const currentRecipient = isReceived ? recipient : currentUser;

    if (!currentRecipient) return null;

    return {
      isReceived,
      currentRecipient,
      recipient,
      displayName: !isReceived
        ? 'You'
        : currentConversation.recipients.length > 2
          ? recipient?.name
          : currentConversation.conversationName || recipient?.name,
      formattedTime: dayjs(message.createdAt).format('hh:mm a'),
    };
  }, [currentConversation, message, currentUser]);

  if (!messageData) return null;

  return (
    <Stack
      component={ButtonBase}
      disableRipple
      onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
      onMouseLeave={() => setAnchorEl(null)}
      sx={{
        alignItems: 'center',
        gap: 1,
        alignSelf: messageData.isReceived ? 'flex-start' : 'flex-end',
        flexDirection: messageData.isReceived ? 'row' : 'row-reverse',
      }}
    >
      <RecipientAvatar recipients={messageData.currentRecipient} />
      <Typography variant="subtitle2">{messageData.displayName}</Typography>
      <Typography variant="caption" color="text.secondary">
        {messageData.formattedTime}
      </Typography>

      <RecipientPopper
        data={messageData.recipient || currentUser}
        anchorEl={anchorEl}
        messageType={message.type}
        handleClose={() => setAnchorEl(null)}
      />
    </Stack>
  );
};

export default MessageHeader;
