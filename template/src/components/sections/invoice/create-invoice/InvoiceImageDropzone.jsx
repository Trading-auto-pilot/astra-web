import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Box, Button, FormHelperText, Stack, Typography } from '@mui/material';
import { convertFileToAttachment } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const InvoiceImageDropzone = () => {
  const {
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const organizationImage = watch('organizationImage');
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const newFile = acceptedFiles[0];
      setValue('organizationImage', {
        id: newFile.name,
        file: newFile,
      });
      setPreview(convertFileToAttachment(newFile));
      clearErrors('organizationImage');
    },
  });

  const handleRemove = () => {
    setValue('organizationImage', null);
    trigger('organizationImage');
    setPreview(null);
  };

  return (
    <Stack direction="column">
      <Box
        {...getRootProps()}
        sx={{
          bgcolor: errors.organizationImage ? 'error.lighter' : 'background.elevation2',
          height: 78,
          borderRadius: 2,
          minWidth: 320,
          borderWidth: 1,
          borderColor: errors.organizationImage ? 'error.main' : 'divider',
          borderStyle: 'dashed',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
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
        {preview || organizationImage ? (
          <Box sx={{ position: 'relative', width: 1, height: 1, p: 1 }}>
            <Image
              src={
                preview
                  ? preview.preview
                  : organizationImage
                    ? organizationImage.file instanceof File
                      ? URL.createObjectURL(organizationImage.file)
                      : organizationImage.file
                    : undefined
              }
              sx={{
                height: 1,
                width: 1,
                objectFit: 'contain',
              }}
            />
            <Button
              color="neutral"
              shape="circle"
              variant="soft"
              sx={({ transitions }) => ({
                position: 'absolute',
                right: 8,
                top: 4,
                zIndex: 2,
                transition: transitions.create('left', {
                  duration: 300,
                  easing: 'ease-in-out',
                }),
                minWidth: 24,
                height: 24,
              })}
              onClick={handleRemove}
            >
              <IconifyIcon icon="material-symbols:close" fontSize={12} />
            </Button>
          </Box>
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            flexWrap="wrap"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              p: 2,
            }}
          >
            <IconifyIcon
              icon="material-symbols:add-photo-alternate-outline-rounded"
              sx={{
                fontSize: { xs: 40, sm: 20 },
                color: 'text.primary',
              }}
            />
            <Typography variant="caption" component="p" sx={{ alignSelf: 'center' }}>
              Drag & Drop files here{' '}
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  mx: 1,
                }}
              >
                or
              </Box>
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                }}
              >
                browse from device
              </Box>
            </Typography>
          </Stack>
        )}
      </Box>
      {errors.organizationImage && (
        <FormHelperText error sx={{ mx: '14px' }}>
          {errors.organizationImage.message}
        </FormHelperText>
      )}
    </Stack>
  );
};

export default InvoiceImageDropzone;
