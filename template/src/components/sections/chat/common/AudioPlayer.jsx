import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useWavesurfer } from '@wavesurfer/react';
import IconifyIcon from 'components/base/IconifyIcon';

const AudioPlayer = ({ src, messageType = 'received', sx, waveOptions, buttonStyles }) => {
  const containerRef = useRef(null);
  const { vars } = useTheme();
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 46,
    waveColor: vars.palette.background.elevation4,
    progressColor: vars.palette.primary.light,
    url: src,
    cursorWidth: 0,
    normalize: true,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    ...waveOptions,
  });

  useEffect(() => {
    if (!wavesurfer) return;

    setDuration(wavesurfer.getDuration());
    wavesurfer.on('timeupdate', setTime);
    wavesurfer.on('ready', () => setDuration(wavesurfer.getDuration()));

    return () => {
      wavesurfer.un('timeupdate', setTime);
      wavesurfer.un('ready', () => setDuration(wavesurfer.getDuration()));
    };
  }, [wavesurfer]);

  const formatTime = (t) => {
    if (!isFinite(t)) return '0:00';

    return `${Math.floor(t / 60)}:${Math.floor(t % 60)
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <Stack
      gap={1}
      sx={{
        alignItems: 'center',
        alignSelf: messageType === 'sent' ? 'flex-end' : 'flex-start',
        borderRadius: 4,
        p: 1.5,
        width: 208,
        bgcolor: 'background.elevation2',
        ...sx,
      }}
    >
      <Stack gap={1} alignItems="center" width={1}>
        <IconButton
          onClick={() => wavesurfer?.playPause()}
          sx={{
            bgcolor: 'background.elevation3',
            '&:hover': { bgcolor: 'background.elevation4' },
            height: 40,
            width: 40,
            ...buttonStyles,
          }}
        >
          <IconifyIcon
            icon={
              isPlaying ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'
            }
            fontSize={24}
          />
        </IconButton>
        <Box ref={containerRef} sx={{ flex: 1 }} />
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary', width: 32 }}>
        {formatTime(isPlaying ? time : duration)}
      </Typography>
    </Stack>
  );
};

export default AudioPlayer;
