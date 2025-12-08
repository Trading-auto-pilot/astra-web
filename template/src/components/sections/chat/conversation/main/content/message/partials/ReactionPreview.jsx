import { Chip, Stack, Tooltip, Typography, chipClasses } from '@mui/material';
import { users } from 'data/users';

const ReactionPreview = ({ reactions, sx }) => {
  return (
    <Tooltip
      title={
        <Stack direction="column" gap={0.5}>
          {reactions.map((reaction) => (
            <Typography key={users[reaction.userId].name} variant="caption">
              {users[reaction.userId].name}: {reaction.emoji}
            </Typography>
          ))}
        </Stack>
      }
    >
      <Chip
        variant="soft"
        sx={{
          alignSelf: 'flex-start',
          [`& .${chipClasses.label}`]: {
            display: 'inline-flex',
            gap: 0.5,
            color: 'text.secondary',
            overflow: 'hidden',
            cursor: 'pointer',
            fontSize: '10px !important',

            '& span': {
              lineHeight: 1.2,
            },
          },
          ...sx,
        }}
        label={
          <>
            {[...new Set(reactions.map((reaction) => reaction.emoji))].map((emoji) => (
              <span key={emoji}>{emoji}</span>
            ))}
            {reactions.length > 1 && <Typography variant="caption">{reactions.length}</Typography>}
          </>
        }
      />
    </Tooltip>
  );
};

export default ReactionPreview;
