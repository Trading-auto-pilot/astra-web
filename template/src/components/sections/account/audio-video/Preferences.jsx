import { useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  Switch,
  Typography,
  formControlLabelClasses,
  sliderClasses,
} from '@mui/material';

const blurMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

const Preferences = () => {
  const [blurBg, setBlurBg] = useState(true);

  return (
    <Stack direction="column" spacing={3} sx={{ mb: 5 }}>
      <FormControl
        component="fieldset"
        variant="standard"
        sx={{ gap: 2, alignItems: 'flex-start' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Meeting Preferences
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Set my status to “🎧” in a meeting"
          sx={{ gap: 2, ml: 0 }}
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Mute my microphone"
          sx={{ gap: 2, ml: 0 }}
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Automatically turn on caption when you’re in meeting"
          sx={{ gap: 2, ml: 0 }}
        />
      </FormControl>
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Blur Background
        </Typography>
        <Paper
          variant="elevation"
          background={1}
          elevation={0}
          component={Stack}
          direction="column"
          spacing={2}
          sx={{ p: 3, borderRadius: 2 }}
        >
          <FormControlLabel
            control={<Switch checked={blurBg} onChange={(e) => setBlurBg(e.target.checked)} />}
            label="Blur your video background"
            sx={{
              gap: 2,
              ml: 0,
              [`${formControlLabelClasses.label}`]: {
                fontWeight: 600,
              },
            }}
          />
          <Box sx={{ width: 1 }}>
            <Typography variant="body2">Adjust your blur percentage</Typography>
            <Slider
              aria-label="Restricted values"
              defaultValue={50}
              step={null}
              valueLabelDisplay="auto"
              marks={blurMarks}
              valueLabelFormat={(x) => `${x}%`}
              disabled={!blurBg}
              sx={{
                [`& .${sliderClasses.mark}`]: {
                  bgcolor: 'inherit',
                },
              }}
            />
          </Box>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default Preferences;
