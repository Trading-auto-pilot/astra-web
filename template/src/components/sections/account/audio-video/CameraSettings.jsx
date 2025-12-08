import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import StyledTextField from 'components/styled/StyledTextField';

const cameraOptions = [
  {
    value: 'built_in_cam',
    label: 'Built in HD Camera',
  },
  {
    value: 'external_webcam',
    label: 'External Webcam',
  },
  {
    value: 'virtual_cam',
    label: 'Virtual Camera',
  },
];

const resolutionOptions = [
  {
    value: 'fhd',
    label: 'FHD (1080p)',
  },
  {
    value: 'hd',
    label: 'HD (720p)',
  },
  {
    value: 'sd',
    label: 'SD (480p)',
  },
];

const CameraSettings = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const [camera, setCamera] = useState(cameraOptions[0].value);
  const [sendResolution, setSendResolution] = useState(resolutionOptions[1].value);
  const [receiveResolution, setReceiveResolution] = useState(resolutionOptions[0].value);

  return (
    <Stack direction="column" spacing={3}>
      <Image
        src={`${assetsDir}/images/account/1.webp`}
        loading="lazy"
        sx={{ width: 1, height: 1, borderRadius: 2 }}
      />
      <Box
        sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' } }}
      >
        <StyledTextField
          select
          value={camera}
          label="Camera"
          fullWidth
          onChange={({ target: { value } }) => setCamera(value)}
          slotProps={{
            select: {
              MenuProps: {
                slotProps: {
                  list: {
                    dense: true,
                  },
                },
              },
            },
          }}
        >
          {cameraOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
        <StyledTextField
          select
          value={sendResolution}
          label="Send resolution (Max)"
          fullWidth
          onChange={({ target: { value } }) => setSendResolution(value)}
          slotProps={{
            select: {
              MenuProps: {
                slotProps: {
                  list: {
                    dense: true,
                  },
                },
              },
            },
          }}
        >
          {resolutionOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
        <StyledTextField
          select
          value={receiveResolution}
          label="Receive resolution (Max)"
          fullWidth
          onChange={({ target: { value } }) => setReceiveResolution(value)}
          slotProps={{
            select: {
              MenuProps: {
                slotProps: {
                  list: {
                    dense: true,
                  },
                },
              },
            },
          }}
        >
          {resolutionOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
      </Box>
    </Stack>
  );
};

export default CameraSettings;
