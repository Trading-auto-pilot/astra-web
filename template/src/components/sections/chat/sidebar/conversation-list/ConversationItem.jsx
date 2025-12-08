import { useMemo } from 'react';
import { useParams } from 'react-router';
import {
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  listItemButtonClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useChatContext } from 'providers/ChatProvider';
import paths from 'routes/paths';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    past: '%s',
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
});

const getLastMessageText = (lastMessage, recipientName) => {
  if (!lastMessage) return '';

  if (lastMessage.attachments?.files?.length) {
    const count = lastMessage.attachments.files.length;

    return lastMessage.type === 'received'
      ? `${recipientName} sent ${count > 1 ? `${count} attachments` : 'an attachment'}.`
      : `sent ${count > 1 ? `${count} attachments` : 'an attachment'}.`;
  }

  if (lastMessage.attachments?.media?.length) {
    const count = lastMessage.attachments.media.length;

    return lastMessage.type === 'received'
      ? `${recipientName} sent ${count > 1 ? `${count} images` : 'an image'}.`
      : `sent ${count > 1 ? `${count} images` : 'an image'}.`;
  }

  return `${lastMessage.text || ''}.`.trim();
};

const ConversationItem = ({ conversation }) => {
  const { handleChatSidebar } = useChatContext();
  const { conversationId } = useParams();
  const { only } = useBreakpoints();

  const onlySm = only('sm');

  const lastMessage = conversation.messages?.[conversation?.messages.length - 1];

  const isUnread = conversation.unreadMessages;

  const isGroup = conversation.recipients && conversation.recipients.length > 1;

  const recipientName = useMemo(() => {
    if (conversation.recipients.length === 1) {
      return conversation.recipients[0].name;
    }

    if (lastMessage?.type === 'received') {
      return (
        conversation.recipients.find(({ id }) => id === lastMessage.senderId)?.name ?? 'Someone'
      );
    }

    return 'you';
  }, [conversation, lastMessage]);

  const conversationName =
    conversation.conversationName || conversation.recipients?.map(({ name }) => name).join(', ');

  return (
    <ListItemButton
      href={paths.chatConversation(conversation.id)}
      selected={conversationId ? conversationId === conversation.id : false}
      onClick={() => handleChatSidebar(false)}
      sx={{
        borderRadius: 4,
        gap: 2,
        p: onlySm ? 1 : (theme) => theme.spacing(1.5, 2),
        [`&.${listItemButtonClasses.selected}`]: {
          bgcolor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24),
          '&:hover': {
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.primary.mainChannel, 0.3),
          },
        },
      }}
    >
      <Tooltip title={conversationName} placement="right" open={onlySm ? undefined : false}>
        <ListItemAvatar sx={{ minWidth: 0 }}>
          <RecipientAvatar
            recipients={isGroup ? conversation.recipients : conversation.recipients[0]}
            avatarStyles={{ width: 48, height: 48 }}
            badgeStyles={{ width: 16, height: 16, border: 3 }}
          />
        </ListItemAvatar>
      </Tooltip>
      <ListItemText
        disableTypography
        sx={{ m: 0, display: { sm: 'none', md: 'block' } }}
        primary={
          <Stack
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Tooltip
              title={conversation.recipients?.map(({ name }) => (
                <Typography key={name} variant="caption" sx={{ display: 'block' }}>
                  {name}
                </Typography>
              ))}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.primary',
                  fontWeight: isUnread ? 700 : 400,
                  lineClamp: 1,
                  wordBreak: 'break-all',
                }}
              >
                {conversationName}
              </Typography>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: isUnread ? 700 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {dayjs(lastMessage?.createdAt).fromNow()}
            </Typography>
          </Stack>
        }
        secondary={
          lastMessage ? (
            <Typography
              variant="body2"
              color={isUnread ? 'text.primary' : 'text.disabled'}
              sx={{ mt: 0.5, lineClamp: 1, fontWeight: isUnread ? 500 : 400 }}
            >
              {lastMessage.type === 'sent' && (
                <Typography
                  variant="body2"
                  component="strong"
                  fontWeight={700}
                  color="text.primary"
                >
                  you:{' '}
                </Typography>
              )}
              {getLastMessageText(lastMessage, recipientName)}
            </Typography>
          ) : null
        }
      />
    </ListItemButton>
  );
};

export default ConversationItem;
