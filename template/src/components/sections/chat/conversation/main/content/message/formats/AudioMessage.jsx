import { Stack } from '@mui/material';
import AudioPlayer from 'components/sections/chat/common/AudioPlayer';

const AudioMessage = ({ media = [], currentMessageType }) => {
  const audioFiles = media.filter((item) => item.type === 'audio');

  if (audioFiles.length === 0) return null;

  return (
    <Stack direction="column" gap={0.5}>
      {audioFiles.map((audio, index) => (
        <AudioPlayer key={index} src={audio.src} messageType={currentMessageType} />
      ))}
    </Stack>
  );
};

export default AudioMessage;
