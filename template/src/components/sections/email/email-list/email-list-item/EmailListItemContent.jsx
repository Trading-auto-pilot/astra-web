import { Avatar, Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

const EmailListItemContent = ({ email }) => {
  const diffInDays = dayjs().diff(dayjs(email.time), 'days');

  return (
    <Box sx={{ overflow: 'hidden', width: 1 }}>
      <Stack spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
        <Avatar src={email.user.avatar} sx={{ width: 24, height: 24 }} />
        <Typography
          variant="body2"
          sx={{
            color: email.readAt === null ? 'text.primary' : 'text.secondary',
            fontWeight: email.readAt === null ? 600 : 400,
            textWrap: 'nowrap',
          }}
        >
          {email.user.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            wordBreak: 'break-all',
            lineClamp: 1,
            mt: '3px',
          }}
        >
          {email.user.email}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            ml: 'auto',
            display: 'flex',
            textWrap: 'nowrap',
            color: email.readAt === null ? 'text.primary' : 'text.secondary',
            fontWeight: email.readAt === null ? 600 : 400,
          }}
        >
          {diffInDays === 0 ? (
            dayjs(email.time).fromNow()
          ) : (
            <>
              <Typography component="span" variant="body2" sx={{ color: 'text.disabled', mr: 0.5 }}>
                {dayjs(email.time).format('hh:mm a')}
              </Typography>
              {diffInDays === 1 ? 'Yesterday' : dayjs(email.time).format('DD MMM')}
            </>
          )}
        </Typography>
      </Stack>
      <Stack sx={{ gap: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            color: email.readAt === null ? 'text.primary' : 'text.secondary',
            fontWeight: email.readAt === null ? 600 : 500,
            textWrap: 'nowrap',
            flexShrink: 0,
          }}
        >
          {email.subject}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', textWrap: 'nowrap', flexShrink: 0 }}
        >
          {email.description}
        </Typography>
      </Stack>
    </Box>
  );
};

export default EmailListItemContent;
