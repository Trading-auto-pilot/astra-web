import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import ColorOptions from './ColorOptions';

const ColorFilter = () => {
  const [enableColorFilter, setEnableColorFilter] = useState(false);
  const { control } = useFormContext();
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Color filter preview
        </Typography>
        <Stack direction="column" sx={{ mb: 1.25 }}>
          <Stack alignItems="center" spacing={2} width={1} height={1}>
            <div>
              <Image
                src={`${assetsDir}/images/account/3.webp`}
                sx={{ objectFit: 'contain', width: 1, height: 1 }}
              />
            </div>
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
              <Image
                src={`${assetsDir}/images/account/4.webp`}
                sx={{ objectFit: 'contain', width: 1, height: 1 }}
              />
            </div>
          </Stack>
          <ColorOptions />
        </Stack>
      </Stack>
      <Stack direction="column" spacing={3}>
        <Stack alignItems="center" spacing={2}>
          <Switch
            checked={enableColorFilter}
            onChange={(e) => {
              setEnableColorFilter(e.target.checked);
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Enable filter
          </Typography>
        </Stack>
        <FormControl>
          <Controller
            control={control}
            name="colorFilter"
            render={({ field }) => (
              <RadioGroup
                aria-labelledby="color-filter-group-label"
                sx={{ alignItems: 'flex-start' }}
                {...field}
              >
                <FormControlLabel
                  value="deuteranopia"
                  control={<Radio />}
                  label="Red-green (green weak, deuteranopia)"
                  disabled={!enableColorFilter}
                />
                <FormControlLabel
                  value="protanopia"
                  control={<Radio />}
                  label="Red-green (red weak, protanopia)"
                  disabled={!enableColorFilter}
                />
                <FormControlLabel
                  value="trianopia"
                  control={<Radio />}
                  label="Blue-yellow (trianopia)"
                  disabled={!enableColorFilter}
                />
                <FormControlLabel
                  value="grayscale"
                  control={<Radio />}
                  label="Grayscale"
                  disabled={!enableColorFilter}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
      </Stack>
    </Stack>
  );
};

export default ColorFilter;
