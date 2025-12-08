import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  dialogClasses,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'components/base/IconifyIcon';

const VideoCapture = () => {
  const videoRef = useRef(null);
  const recordedVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { setValue, watch } = useFormContext();
  const [state, setState] = useState({
    isOpen: false,
    stream: null,
    isDenied: false,
    isRecording: false,
    recordedBlob: null,
  });

  const currentAttachments = watch('attachments') || [];

  const setupCamera = async () => {
    try {
      const { state: permState } = await navigator.permissions.query({
        name: 'camera',
      });
      if (permState === 'denied') throw new Error();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!state.isOpen) {
        stream.getTracks().forEach((track) => track.stop());

        return true;
      }

      setState((prev) => ({ ...prev, stream, isDenied: false }));
      if (videoRef.current) videoRef.current.srcObject = stream;

      return true;
    } catch {
      enqueueSnackbar('Camera access denied.', { variant: 'error' });
      setState((prev) => ({ ...prev, isDenied: true }));

      return false;
    }
  };

  const handleStartRecording = () => {
    if (!state.stream) return;

    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(state.stream, options);
    mediaRecorderRef.current = mediaRecorder;
    setRecordedChunks([]);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
    setState((prev) => ({ ...prev, isRecording: true }));
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setState((prev) => ({ ...prev, isRecording: false }));
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
      setState((prev) => ({ ...prev, recordedBlob }));

      if (recordedVideoRef.current) {
        recordedVideoRef.current.src = URL.createObjectURL(recordedBlob);
      }

      const videoFile = new File([recordedBlob], `video-${Date.now()}.webm`, {
        type: 'video/webm',
      });

      const newAttachment = { type: 'video', file: videoFile };
      setValue('attachments', [...currentAttachments, newAttachment]);
    }
  }, [recordedChunks]);

  const handleOpenCamera = async () => {
    const hasAccess = await setupCamera();
    if (hasAccess) setState((prev) => ({ ...prev, isOpen: true }));
  };

  const handleCloseCamera = () => {
    state.stream?.getTracks().forEach((track) => track.stop());
    setState({
      isOpen: false,
      stream: null,
      isDenied: false,
      isRecording: false,
      recordedBlob: null,
    });
  };

  useEffect(() => {
    if (state.isOpen) setupCamera();

    return () => state.stream?.getTracks().forEach((track) => track.stop());
  }, [state.isOpen]);

  return (
    <>
      <Tooltip title="Record Video">
        <Button shape="square" color="neutral" onClick={handleOpenCamera}>
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
            <IconifyIcon icon="material-symbols:videocam-outline-rounded" fontSize={20} />
          </Badge>
        </Button>
      </Tooltip>

      <Dialog
        open={state.isOpen && !state.isDenied}
        onClose={handleCloseCamera}
        maxWidth="sm"
        fullWidth
        sx={{
          [`& .${dialogClasses.paper}`]: {
            m: { xs: 2, sm: 4 },
          },
        }}
      >
        <Stack
          direction="column"
          gap={2}
          alignItems="center"
          p={{ xs: 2, sm: 3 }}
          position="relative"
        >
          <Stack width={1} justifyContent="space-between" alignItems="center">
            <DialogTitle sx={{ p: 0 }}>Record a Video</DialogTitle>

            <IconButton size="small" onClick={handleCloseCamera}>
              <IconifyIcon icon="material-symbols:close" />
            </IconButton>
          </Stack>

          <Box
            ref={videoRef}
            component="video"
            autoPlay
            playsInline
            sx={{ width: 1, borderRadius: 2 }}
          />

          <Stack direction="row" spacing={2}>
            {state.isRecording ? (
              <Button variant="contained" color="error" onClick={handleStopRecording}>
                <IconifyIcon icon="material-symbols:stop-circle-outline" fontSize={20} />
                Stop Recording
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleStartRecording}>
                <IconifyIcon icon="material-symbols:play-circle-outline" fontSize={20} />
                Start Recording
              </Button>
            )}
          </Stack>

          {state.recordedBlob && (
            <Box width="100%">
              <video ref={recordedVideoRef} controls style={{ width: '100%', borderRadius: 8 }} />
            </Box>
          )}
        </Stack>
      </Dialog>
    </>
  );
};

export default VideoCapture;
