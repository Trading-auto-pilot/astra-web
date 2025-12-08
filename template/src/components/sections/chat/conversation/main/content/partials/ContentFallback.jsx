import { Chip, Stack, Typography } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import { SENT_MESSAGE } from 'reducers/ChatReducer';

const ContentFallback = () => {
  const { chatDispatch, currentConversation } = useChatContext();

  const handleNewMessage = (text) => {
    if (!currentConversation) return;

    chatDispatch({
      type: SENT_MESSAGE,
      payload: {
        conversationId: currentConversation.id,
        message: { text },
      },
    });
  };

  return (
    <Stack
      component={Stack}
      sx={{
        height: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        maxWidth: 300,
      }}
    >
      <Typography variant="subtitle2" mb={1}>
        No messages here yet.
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" mb={3}>
        Write something or tap on one of the messages to start a conversation
      </Typography>

      {["Hey there! 👋 How's your day going?", 'Hi! What are you up to today? 😄'].map(
        (text, i) => (
          <Chip
            key={i}
            label={text}
            variant="soft"
            color="neutral"
            sx={{ mb: 1 }}
            onClick={() => handleNewMessage(text)}
          />
        ),
      )}
    </Stack>
  );
};

export default ContentFallback;
