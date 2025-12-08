import { Avatar, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEmailContext } from 'providers/EmailProvider';
import Image from 'components/base/Image';

const EmailDetailsContent = () => {
  const {
    emailState: { email },
  } = useEmailContext();

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 400, my: 3 }}>
        {email?.subject}
      </Typography>
      <Stack spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Avatar alt={email?.user.name} src={email?.user.avatar} sx={{ width: 32, height: 32 }} />
        <div>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {email?.user.name}
          </Typography>
          <Typography variant="caption" component="p" sx={{ mb: 0.5 }}>
            {email?.user.email}
          </Typography>
          <Typography variant="caption" sx={{ mr: 0.5, color: 'text.disabled' }}>
            To:{' '}
          </Typography>
          <Typography variant="caption">Me, anotherperson@email.com</Typography>
        </div>
        <Typography variant="body2" sx={{ ml: 'auto' }}>
          {dayjs(email?.time).fromNow()}
        </Typography>
      </Stack>
      {email?.details}
      {email?.attachments && (
        <Stack direction="column" spacing={2} sx={{ alignItems: 'start', mt: 3 }}>
          {email.attachments.map(
            (attachment) =>
              attachment.fileType === 'image' && (
                <Image key={attachment.id} src={attachment.file} alt="" />
              ),
          )}
        </Stack>
      )}
    </>
  );
};

export default EmailDetailsContent;
