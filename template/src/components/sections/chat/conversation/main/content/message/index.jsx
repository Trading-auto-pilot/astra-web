import { useState } from 'react';
import { Stack } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import FileContent from './content/FileContent';
import MediaContent from './content/MediaContent';
import TextContent from './content/TextContent';
import ActionButtons from './partials/ActionButtons';
import MessageHeader from './partials/MessageHeader';
import ReactionPreview from './partials/ReactionPreview';

const Message = ({ message }) => {
  const { currentConversation } = useChatContext();
  const [showActions, setShowActions] = useState(false);

  return (
    <Stack
      direction="column"
      sx={{
        py: 0.5,
        px: { xs: 3, md: 5 },
        gap: 1,
        '&:hover': { bgcolor: 'background.elevation1' },
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {currentConversation && <MessageHeader message={message} />}

      <Stack
        direction={message.type === 'received' ? 'row' : 'row-reverse'}
        alignItems="center"
        gap={1}
      >
        <Stack direction="column" gap={0.5}>
          <TextContent message={message} />
          <MediaContent message={message} />
          <FileContent message={message} />
        </Stack>

        <ActionButtons message={message} show={showActions} />
      </Stack>

      {Array.isArray(message.reactions) && message.reactions.length > 0 && (
        <ReactionPreview
          reactions={message.reactions}
          sx={{
            position: 'relative',
            alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start',
            m: (theme) =>
              theme.spacing(
                -2,
                message.type === 'sent' ? 2 : 0,
                0,
                message.type === 'received' ? 2 : 0,
              ),
          }}
        />
      )}
    </Stack>
  );
};

export default Message;
