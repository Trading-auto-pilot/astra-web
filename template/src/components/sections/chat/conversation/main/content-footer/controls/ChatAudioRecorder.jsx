import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge, Box, Button, Popover, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useWavesurfer } from '@wavesurfer/react';
import { useSnackbar } from 'notistack';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';
import IconifyIcon from 'components/base/IconifyIcon';

const ChatAudioRecorder = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const timerRef = useRef();
  const { setValue, getValues } = useFormContext();

  const [state, setState] = useState({
    isRecording: false,
    duration: 0,
    anchorEl: null,
    isDenied: false,
  });

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 56,
    waveColor: theme.vars.palette.primary.light,
    progressColor: theme.vars.palette.primary.main,
    cursorColor: theme.vars.palette.primary.dark,
    plugins: useMemo(() => [], []),
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
  });

  const record = useMemo(() => {
    if (!wavesurfer) return null;
    const plugin = wavesurfer.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
        renderRecordedAudio: true,
        audioBitsPerSecond: 128000,
      }),
    );

    plugin.on('record-end', (blob) => {
      const file = new File([blob], `audio-${Date.now()}.wav`, { type: 'audio/wav' });

      const currentAttachments = getValues('attachments') || [];

      setValue('attachments', [...currentAttachments, { type: 'audio', file }]);

      setState((prev) => ({ ...prev, anchorEl: null }));
    });

    return plugin;
  }, [wavesurfer]);

  useEffect(() => {
    return () => timerRef.current && clearInterval(timerRef.current);
  }, []);

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      return true;
    } catch (error) {
      console.error('Mic permission error:', error);

      return false;
    }
  };

  const handleRecord = async () => {
    if (!record) return;

    if (state.isRecording) {
      await record.stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      setState((prev) => ({ ...prev, isRecording: false, duration: 0 }));

      return;
    }

    try {
      if (!(await checkMicPermission())) throw new Error('Mic denied');

      const devices = await RecordPlugin.getAvailableAudioDevices();
      if (!devices.length) throw new Error('No audio devices');

      setState((prev) => ({
        ...prev,
        isDenied: false,
        anchorEl: buttonRef.current,
        isRecording: true,
      }));

      await record.startRecording({ deviceId: devices[0].deviceId });
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
      setState((prev) => ({ ...prev, anchorEl: null, isDenied: true }));
      enqueueSnackbar('Microphone access denied.', { variant: 'error' });
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <>
      <Tooltip
        title={
          state.isRecording
            ? 'Stop Recording'
            : state.isDenied
              ? 'Microphone access denied'
              : 'Record'
        }
      >
        <Button
          ref={buttonRef}
          shape="square"
          color={state.isRecording ? 'error' : 'neutral'}
          onClick={handleRecord}
        >
          <Badge
            badgeContent={
              <IconifyIcon
                icon="material-symbols:block"
                sx={{ color: 'error.main', fontSize: 16 }}
              />
            }
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            invisible={!state.isDenied}
          >
            <IconifyIcon
              icon={
                state.isRecording ? 'material-symbols:stop' : 'material-symbols:mic-outline-rounded'
              }
              fontSize={20}
            />
          </Badge>
        </Button>
      </Tooltip>

      <Popover
        open={!!state.anchorEl}
        anchorEl={state.anchorEl}
        hideBackdrop
        keepMounted
        disablePortal
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{ paper: { sx: { mt: -2 } } }}
        sx={{ pointerEvents: 'none' }}
      >
        <Stack alignItems="center" gap={1} width={1} sx={{ p: 1 }}>
          <Box
            ref={containerRef}
            sx={{
              height: 56,
              width: 208,
              overflow: 'hidden',
              '& wave': { overflow: 'hidden !important' },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {formatTime(state.duration)}
          </Typography>
        </Stack>
      </Popover>
    </>
  );
};

export default ChatAudioRecorder;
