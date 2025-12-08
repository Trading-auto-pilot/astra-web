import { Fragment, useEffect, useMemo, useRef } from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useChatContext } from 'providers/ChatProvider';
import Message from './message';
import ContentSkeleton from './message/partials/ContentSkeleton';
import ContentFallback from './partials/ContentFallback';
import StarterMessage from './partials/StarterMessage';

const Content = () => {
  const { currentConversation, shouldMessagesScroll } = useChatContext();
  const messageEndRef = useRef(null);

  const messagesWithDates = useMemo(() => {
    if (!currentConversation?.messages.length) return [];

    let prevDate = '';

    return currentConversation.messages.map((message) => {
      const messageDate = dayjs(message.createdAt).format('MMMM DD, YYYY');
      const showDate = messageDate !== prevDate;
      prevDate = messageDate;

      return {
        message,
        date: messageDate,
        showDate,
      };
    });
  }, [currentConversation?.messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (shouldMessagesScroll) {
        messageEndRef.current?.scrollIntoView();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentConversation, shouldMessagesScroll]);

  return (
    <Stack direction="column" sx={{ gap: 1, height: 1, alignItems: 'flex-start', py: 5 }}>
      {currentConversation ? (
        currentConversation.messages.length > 0 ? (
          <StarterMessage />
        ) : (
          <ContentFallback />
        )
      ) : (
        <ContentSkeleton />
      )}

      <Stack sx={{ width: 1, flexDirection: 'column' }}>
        {messagesWithDates.map(({ message, date, showDate }) => (
          <Fragment key={message.id}>
            {showDate && (
              <Divider flexItem sx={{ my: 2, px: { xs: 3, md: 5 } }}>
                <Typography variant="caption" color="text.secondary">
                  {date}
                </Typography>
              </Divider>
            )}
            <Message message={message} />
          </Fragment>
        ))}
        <span ref={messageEndRef} />
      </Stack>
    </Stack>
  );
};

export default Content;
