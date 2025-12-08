import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Button, Stack, Tooltip, Typography, Zoom } from '@mui/material';
import { cssVarRgba, getFileExtension, getFileIcon } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import AudioPlayer from 'components/sections/chat/common/AudioPlayer';

const AttachmentPreview = ({ attachment, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);
  const { setValue, watch } = useFormContext();

  const attachments = watch('attachments') || [];

  useEffect(() => {
    if (['image', 'video', 'audio'].includes(attachment.type)) {
      const url = URL.createObjectURL(attachment.file);
      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [attachment]);

  const removeAttachment = (index) => {
    setValue(
      'attachments',
      attachments.filter((_, i) => i !== index),
    );

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {attachment.type === 'file' && (
        <Stack
          sx={{
            alignItems: 'center',
            gap: 1,
            borderRadius: 3,
            p: (theme) => theme.spacing(1, 3, 1, 1),
            width: 184,
            maxWidth: 184,
            bgcolor: 'background.elevation3',
          }}
        >
          <Stack
            sx={{
              flexShrink: 0,
              height: 40,
              width: 40,
              borderRadius: 2,
              p: 1,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => cssVarRgba(theme.vars.palette.common.whiteChannel, 0.36),
            }}
          >
            <IconifyIcon
              icon={getFileIcon(getFileExtension(attachment.file.name))}
              sx={{ fontSize: 24, color: 'text.primary' }}
            />
          </Stack>
          <Tooltip title={attachment.file.name}>
            <Typography
              variant="subtitle2"
              sx={{
                lineClamp: 2,
                overflow: 'hidden',
                wordBreak: 'break-all',
                color: 'text.secondary',
              }}
            >
              {attachment.file.name.length > 20
                ? `${attachment.file.name.substring(0, 20)}...${getFileExtension(attachment.file.name)}`
                : attachment.file.name}
            </Typography>
          </Tooltip>
        </Stack>
      )}

      {attachment.type === 'audio' && objectUrl && (
        <AudioPlayer
          src={objectUrl}
          sx={{ bgcolor: 'background.elevation3', p: 1, pr: 2, height: 56 }}
          buttonStyles={{ bgcolor: 'background.elevation4' }}
          waveOptions={{ height: 40 }}
        />
      )}

      {attachment.type === 'image' && objectUrl && (
        <Box
          sx={{
            height: 56,
            width: 56,
            borderRadius: 3,
            bgcolor: 'background.elevation3',
            overflow: 'hidden',
          }}
        >
          <Image src={objectUrl} alt="" sx={{ width: 1, height: 1, objectFit: 'cover' }} />
        </Box>
      )}

      {attachment.type === 'video' && objectUrl && (
        <Box
          sx={{
            height: 56,
            width: 56,
            borderRadius: 3,
            bgcolor: 'background.elevation3',
            overflow: 'hidden',
          }}
        >
          <Box
            component="video"
            src={objectUrl}
            controls
            sx={{
              width: 1,
              height: 1,
              objectFit: 'contain',
            }}
          />
        </Box>
      )}

      <Zoom in={isHovered}>
        <Button
          variant="contained"
          shape="circle"
          color="neutral"
          size="small"
          sx={{ position: 'absolute', top: -4, right: -4, height: 16, minWidth: 16 }}
          onClick={() => removeAttachment(index)}
        >
          <IconifyIcon icon="material-symbols:close" fontSize={12} />
        </Button>
      </Zoom>
    </Box>
  );
};

export default AttachmentPreview;
