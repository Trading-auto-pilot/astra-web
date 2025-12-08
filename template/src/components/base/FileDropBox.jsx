import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, Stack } from '@mui/material';
import { convertFileToAttachment } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import FilePreview from 'components/common/FilePreview';

const FileDropBox = ({ onDrop, error, onRemove, defaultFiles, sx, ...rest }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleRemoveFile = (index) => {
    setFiles(files.filter((file, ind) => index !== ind));
    setPreviews(previews.filter((file, ind) => index !== ind));
    if (onRemove) {
      onRemove(index);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (...args) => {
      const [acceptedFiles] = args;
      setFiles(acceptedFiles);
      setPreviews(acceptedFiles.map((file) => convertFileToAttachment(file)));
      if (onDrop) {
        onDrop(...args);
      }
    },
    ...rest,
  });

  useEffect(() => {
    if (defaultFiles) {
      setFiles(defaultFiles);
      setPreviews(defaultFiles.map((file) => convertFileToAttachment(file)));
    }
  }, [defaultFiles]);

  return (
    <Stack
      spacing={1}
      sx={{
        flexWrap: 'wrap',
        ...sx,
      }}
    >
      {previews.length > 0 &&
        previews.map((preview, index) => (
          <Box
            key={`${preview.preview}`}
            sx={{
              position: 'relative',
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <FilePreview preview={preview} />
            <Button
              onClick={() => handleRemoveFile(index)}
              sx={{
                position: 'absolute',
                top: -6,
                right: -6,
                height: 12,
                minWidth: 12,
              }}
              variant="contained"
              color="neutral"
              shape="circle"
              size="small"
            >
              <IconifyIcon icon="material-symbols:close-small-rounded" fontSize={10} />
            </Button>
          </Box>
        ))}
      <Box
        {...getRootProps()}
        sx={{
          p: 2,
          bgcolor: error ? 'error.lighter' : 'background.elevation2',
          height: 56,
          width: 56,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: error ? 'error.main' : 'divider',
          borderStyle: 'dashed',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          transition: ({ transitions }) =>
            transitions.create(['background-color'], {
              duration: transitions.duration.enteringScreen,
              easing: transitions.easing.easeInOut,
            }),
          '&:hover': {
            bgcolor: 'background.elevation3',
          },
        }}
      >
        <input {...getInputProps()} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          <IconifyIcon
            icon="material-symbols:add-photo-alternate-outline-rounded"
            sx={{
              fontSize: 20,
              color: 'text.secondary',
            }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default FileDropBox;
