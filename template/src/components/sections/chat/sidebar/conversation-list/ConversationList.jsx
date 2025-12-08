import { useMemo } from 'react';
import { List, Stack } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import CollapsiblePanel from './CollapsiblePanel';
import ConversationItem from './ConversationItem';

const ConversationList = () => {
  const { conversations, filterBy } = useChatContext();

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(Boolean)
      .filter((conversation) =>
        filterBy === 'starred'
          ? conversation.starred
          : filterBy === 'unread'
            ? conversation.unreadMessages
            : true,
      )
      .reduce(
        (acc, conversation) => {
          if (conversation.starred) {
            acc.starred.push(conversation);
          } else {
            acc.messages.push(conversation);
          }

          return acc;
        },
        { starred: [], messages: [] },
      );
  }, [conversations, filterBy]);

  return (
    <Stack direction="column" height={1}>
      {Object.entries(filteredConversations).map(
        ([key, conversations]) =>
          conversations.length > 0 && (
            <CollapsiblePanel
              key={key}
              title={key}
              defaultOpen
              sx={{ mb: { xs: 2, sm: 0, md: 2 } }}
            >
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                {conversations.map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </List>
            </CollapsiblePanel>
          ),
      )}
    </Stack>
  );
};

export default ConversationList;
