import { Stack, Typography } from '@mui/material';
import { useChatContext } from 'providers/ChatProvider';
import RecipientAvatar from 'components/sections/chat/common/RecipientAvatar';

const StarterMessage = () => {
  const { currentConversation } = useChatContext();

  if (!currentConversation) return;

  return (
    <Stack sx={{ alignItems: 'center', gap: 2, px: { xs: 3, md: 5 } }}>
      {currentConversation && (
        <RecipientAvatar
          recipients={currentConversation.recipients}
          avatarStyles={{ width: 80, height: 80 }}
          badgeStyles={{ width: 20, height: 20, border: 3 }}
        />
      )}
      <Typography variant="subtitle2" lineHeight={1.6}>
        This is the very beginning of the conversation between <strong>you</strong>
        {currentConversation.recipients.length > 1 ? (
          <>
            ,{' '}
            <strong>
              {currentConversation.recipients
                .slice(0, 2)
                .map(({ name }) => name)
                .join(', ')}
            </strong>
            {currentConversation.recipients.length > 2 && (
              <>
                {' '}
                and{' '}
                <strong>
                  {currentConversation.recipients.length === 3
                    ? currentConversation.recipients[2].name
                    : `${currentConversation.recipients.length - 2} others`}
                </strong>
              </>
            )}
          </>
        ) : (
          <>
            {' '}
            and <strong>{currentConversation.recipients[0].name}</strong>
          </>
        )}
      </Typography>
    </Stack>
  );
};

export default StarterMessage;
