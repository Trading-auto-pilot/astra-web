import { useState } from 'react';
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';

const micOptions = [
  {
    value: 'built_in_mic',
    label: 'Built in Microphone (System Default)',
  },
  {
    value: 'external_mic',
    label: 'External Microphone (USB)',
  },
  {
    value: 'headset_mic',
    label: 'Headset Microphone',
  },
  {
    value: 'wireless_mic',
    label: 'Wireless Microphone (Bluetooth)',
  },
];
const speakerOptions = [
  {
    value: 'built_in_speaker',
    label: 'Built in Speaker (System Default)',
  },
  {
    value: 'external_speaker',
    label: 'External Speaker (USB)',
  },
  {
    value: 'headset_speaker',
    label: 'Headset Speaker',
  },
  {
    value: 'wireless_speaker',
    label: 'Wireless Speaker (Bluetooth)',
  },
];

const MicrophoneSpeaker = () => {
  const [microphone, setMicrophone] = useState(micOptions[0].value);
  const [speaker, setSpeaker] = useState(speakerOptions[0].value);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="column" spacing={1}>
        <StyledTextField
          select
          value={microphone}
          label="Microphone"
          onChange={({ target: { value } }) => setMicrophone(value)}
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
          {micOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ textWrap: 'nowrap' }}>
            Input level:
          </Typography>
          <Stack sx={{ width: 1, gap: 0.5 }}>
            {Array.from({ length: 15 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: index < 9 ? 'info.main' : 'info.lighter',
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1, alignItems: 'end' }}>
        <StyledTextField
          select
          value={speaker}
          label="Speaker"
          fullWidth
          onChange={({ target: { value } }) => setSpeaker(value)}
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
          {speakerOptions.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </StyledTextField>
        <Button variant="soft" color="neutral">
          Test speaker
        </Button>
      </Box>
    </Stack>
  );
};

export default MicrophoneSpeaker;
