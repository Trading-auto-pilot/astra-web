import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  Tooltip,
  dialogClasses,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const ChatCameraCapture = () => {
  const { up } = useBreakpoints();
  const videoRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { setValue, watch } = useFormContext();
  const [state, setState] = useState({
    isOpen: false,
    stream: null,
    isDenied: false,
  });

  const upSm = up('sm');

  const currentAttachments = watch('attachments') || [];

  const setupCamera = async () => {
    try {
      const { state: permState } = await navigator.permissions.query({
        name: 'camera',
      });
      if (permState === 'denied') throw new Error();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
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

  const handleCapture = () => {
    if (!videoRef.current || !state.stream) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const newAttachment = {
          type: 'image',
          file: new File([blob], `cam-${Date.now()}.jpg`, { type: 'image/jpeg' }),
        };

        setValue('attachments', [...currentAttachments, newAttachment]);
      }
      handleCloseCamera();
    }, 'image/jpeg');
  };

  const handleOpenCamera = async () => {
    const hasAccess = await setupCamera();
    if (hasAccess) setState((prev) => ({ ...prev, isOpen: true }));
  };

  const handleCloseCamera = () => {
    state.stream?.getTracks().forEach((track) => track.stop());
    setState({ isOpen: false, stream: null, isDenied: false });
  };

  useEffect(() => {
    if (state.isOpen) setupCamera();

    return () => state.stream?.getTracks().forEach((track) => track.stop());
  }, [state.isOpen]);

  return (
    <>
      <Tooltip title="Camera">
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
            <IconifyIcon icon="material-symbols:photo-camera-outline-rounded" fontSize={20} />
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
            <DialogTitle sx={{ p: 0 }}>Take a photo</DialogTitle>

            <IconButton size="small" onClick={handleCloseCamera}>
              <IconifyIcon icon="material-symbols:close" />
            </IconButton>
          </Stack>

          <Box
            ref={videoRef}
            component="video"
            autoPlay
            playsInline
            sx={{ width: 1, borderRadius: 2, transform: 'scaleX(-1)' }}
          />

          <Tooltip title="Capture">
            <Fab
              size={upSm ? 'large' : 'small'}
              color="primary"
              onClick={handleCapture}
              sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}
            >
              <IconifyIcon icon="material-symbols:photo-camera" fontSize={24} />
            </Fab>
          </Tooltip>
        </Stack>
      </Dialog>
    </>
  );
};

export default ChatCameraCapture;
