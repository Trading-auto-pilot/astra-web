import { Container, Typography } from '@mui/material';
import MessageWrapper from '../MessageWrapper';

const isOnlyEmojis = (text) => {
  const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\s)+$/u;

  return emojiRegex.test(text.trim()) && /\p{Emoji_Presentation}/u.test(text);
};

const TextContent = ({ message }) => {
  const { text, type } = message;
  if (!text) return null;

  const isEmoji = isOnlyEmojis(text);

  return (
    <MessageWrapper
      key="message"
      message={message}
      sx={isEmoji ? [{ bgcolor: 'transparent', p: 0 }] : []}
    >
      <Container maxWidth="xs" sx={{ px: '0px !important' }}>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: type === 'sent' ? 'primary.contrastText' : 'text.secondary',
            fontSize: (theme) =>
              isEmoji ? theme.typography.h2.fontSize : theme.typography.body2.fontSize,
            lineHeight: (theme) => (isEmoji ? 1.2 : theme.typography.body2.lineHeight),
          }}
        >
          {text}
        </Typography>
      </Container>
    </MessageWrapper>
  );
};

export default TextContent;
