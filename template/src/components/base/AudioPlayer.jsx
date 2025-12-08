import { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography,
  sliderClasses,
} from '@mui/material';
import { secondsToMs } from 'lib/utils';
import IconifyIcon from './IconifyIcon';

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [isSeeking]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleSeek = (_, newValue) => {
    if (typeof newValue === 'number') {
      setProgress(newValue);
      setCurrentTime((newValue / 100) * duration);
    }
  };

  const handleSeekCommit = (_, newValue) => {
    if (typeof newValue === 'number' && audioRef.current) {
      audioRef.current.currentTime = (newValue / 100) * duration;
      setIsSeeking(false);
    }
  };

  const handleDownload = () => {
    if (!src) return;

    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'audio-file.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        width: 1,
        p: 1,
        borderRadius: 50,
        bgcolor: 'background.elevation2',
      }}
    >
      <Box component="audio" ref={audioRef} src={src} controls style={{ display: 'none' }} />

      <IconButton onClick={togglePlayPause} color="primary">
        <IconifyIcon
          icon={
            isPlaying
              ? 'material-symbols:pause-circle-rounded'
              : 'material-symbols:play-circle-rounded'
          }
          sx={{ fontSize: 24 }}
        />
      </IconButton>

      <Typography variant="overline" sx={{ fontWeight: 500, textWrap: 'nowrap' }}>
        {secondsToMs(currentTime)} / {secondsToMs(duration)}
      </Typography>
      <Slider
        value={progress}
        size="small"
        onChange={handleSeek}
        onChangeCommitted={handleSeekCommit}
        onMouseDown={() => setIsSeeking(true)}
        onMouseUp={() => setIsSeeking(false)}
        sx={{
          flexGrow: 1,
          height: 6,
          mx: 1,
          [`& .${sliderClasses.thumb}`]: {
            width: 12,
            height: 12,
            bgcolor: 'primary.main',
            '&:after': {
              width: 18,
              height: 18,
            },
          },
          [`& .${sliderClasses.track}`]: {
            bgcolor: 'primary.main',
          },
          [`& .${sliderClasses.rail}`]: {
            bgcolor: 'primary.light',
          },
        }}
      />
      <Stack gap={0.5}>
        <IconButton onClick={toggleMute}>
          <IconifyIcon
            icon={
              isMuted
                ? 'material-symbols:volume-off-outline-rounded'
                : 'material-symbols:volume-up-outline-rounded'
            }
            sx={{ color: 'text.primary', fontSize: 20 }}
          />
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <IconifyIcon
            icon="material-symbols:more-vert"
            sx={{ color: 'text.primary', fontSize: 20 }}
          />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleDownload}>Download</MenuItem>
        </Menu>
      </Stack>
    </Stack>
  );
};

export default AudioPlayer;
