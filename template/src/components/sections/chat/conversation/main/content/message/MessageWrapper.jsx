import { useMemo } from 'react';
import { Paper } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';

const MessageWrapper = ({ message, sx, children }) => {
  const { currentConversation } = useChatContext();

  if (!currentConversation) return null;

  const { prevMessageSenderId, prevMessageType } = useMemo(() => {
    const index = currentConversation.messages.findIndex((m) => m.id === message.id);
    if (index <= 0) return { prevMessageSenderId: undefined, prevMessageType: undefined };

    const prevMessage = currentConversation.messages[index - 1];

    return {
      prevMessageSenderId: prevMessage.senderId,
      prevMessageType: prevMessage.type,
    };
  }, [currentConversation.messages, message.id]);

  return (
    <Paper
      sx={[
        {
          outline: 'none',
          position: 'relative',
          borderRadius: (theme) => {
            if (message.type === prevMessageType && message.senderId === prevMessageSenderId) {
              return theme.spacing(2, 2, 2, 2);
            }

            return message.type === 'sent' ? theme.spacing(2, 0, 2, 2) : theme.spacing(0, 2, 2, 2);
          },
          width: 'fit-content',
          alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start',
          bgcolor: message.type === 'sent' ? 'primary.main' : 'background.elevation2',
          px: 3,
          py: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Paper>
  );
};

export default MessageWrapper;
