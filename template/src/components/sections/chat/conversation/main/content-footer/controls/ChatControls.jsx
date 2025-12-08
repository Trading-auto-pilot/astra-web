import { Button, Divider, Stack, Tooltip, buttonBaseClasses } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ChatAttachments from './ChatAttachments';
import ChatAudioRecorder from './ChatAudioRecorder';
import ChatCameraCapture from './ChatCameraCapture';
import ChatEmojiPicker from './ChatEmojiPicker';

const ChatControls = () => {
  return (
    <Stack
      direction="row"
      sx={{
        [`& .${buttonBaseClasses.root}:hover`]: {
          bgcolor: (theme) => `${theme.vars.palette.background.elevation3} !important`,
        },
      }}
    >
      <ChatEmojiPicker />
      <ChatAttachments />
      <Tooltip title="Mention">
        <Button shape="square" color="neutral">
          <IconifyIcon icon="material-symbols:alternate-email-rounded" fontSize={20} />
        </Button>
      </Tooltip>
      <Divider flexItem variant="middle" orientation="vertical" sx={{ mx: 1 }} />
      <ChatCameraCapture />
      <ChatAudioRecorder />
    </Stack>
  );
};

export default ChatControls;
