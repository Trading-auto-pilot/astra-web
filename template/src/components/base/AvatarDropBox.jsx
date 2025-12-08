import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Stack, Typography } from '@mui/material';
import { convertFileToAttachment, getFileNameFromUrl } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from './Image';

const AvatarDropBox = ({ onDrop, error, defaultFile, sx, ...rest }) => {
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (...args) => {
      const [acceptedFiles] = args;
      if (acceptedFiles.length > 0) {
        setPreview(convertFileToAttachment(acceptedFiles[0]));
        if (onDrop) {
          onDrop(...args);
        }
      }
    },
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    ...rest,
  });

  useEffect(() => {
    if (defaultFile) {
      if (typeof defaultFile === 'string') {
        setPreview({
          name: getFileNameFromUrl(defaultFile),
          preview: defaultFile,
          format: 'image',
        });
      } else {
        setPreview(convertFileToAttachment(defaultFile));
      }
    }
  }, [defaultFile]);

  return (
    <Box
      {...getRootProps()}
      sx={{
        bgcolor: error ? 'error.lighter' : 'background.elevation2',
        height: 144,
        width: 144,
        borderRadius: '50%',
        borderWidth: 1,
        borderColor: error ? 'error.main' : 'divider',
        borderStyle: 'dashed',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: ({ transitions }) =>
          transitions.create(['background-color'], {
            duration: transitions.duration.enteringScreen,
            easing: transitions.easing.easeInOut,
          }),
        '&:hover': {
          bgcolor: 'background.elevation3',
        },
        ...sx,
      }}
    >
      <input {...getInputProps()} />
      {preview && (
        <Image
          src={preview?.preview}
          alt={preview?.name}
          sx={{
            width: 1,
            height: 1,
            borderRadius: '50%',
          }}
        />
      )}

      <Stack
        direction="column"
        sx={[
          {
            position: 'absolute',
            height: 1,
            width: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            color: 'text.secondary',
            transition: ({ transitions }) =>
              transitions.create(['background-color', 'opacity'], {
                duration: transitions.duration.enteringScreen,
                easing: transitions.easing.easeInOut,
              }),
          },
          !!preview?.preview && {
            opacity: 0,
            '&:hover': {
              opacity: 1,
              bgcolor: 'rgba(255, 255, 255, 0.8)',
            },
          },
        ]}
      >
        <IconifyIcon
          icon="material-symbols:add-a-photo-outline-rounded"
          sx={{
            fontSize: 20,
          }}
        />
        {!(sx?.width < 100) && <Typography variant="caption">Upload Avatar</Typography>}
      </Stack>
    </Box>
  );
};

export default AvatarDropBox;
