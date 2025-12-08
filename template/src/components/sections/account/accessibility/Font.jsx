import { Controller, useFormContext } from 'react-hook-form';
import { Slider, Stack, TextField, Typography, inputBaseClasses } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const Font = () => {
  const { control, watch } = useFormContext();
  const textSize = watch('textSize');

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Text size
      </Typography>
      <TextField
        multiline
        rows={3.5}
        size="medium"
        placeholder="Lorem ipsum dolor sit amet consectetur."
        sx={{
          [`& .${inputBaseClasses.input}`]: {
            fontSize: `${Number(textSize)}px`,
          },
        }}
      />
      <Stack spacing={2} alignItems="center">
        <IconifyIcon icon="material-symbols:text-fields" sx={{ fontSize: 24 }} />
        <Controller
          control={control}
          name="textSize"
          render={({ field }) => (
            <Slider
              aria-label="font-size"
              getAriaValueText={(val) => `${val}px`}
              valueLabelFormat={(val) => `${Number(val)}px`}
              valueLabelDisplay="auto"
              min={12}
              max={24}
              step={1}
              {...field}
            />
          )}
        />
        <IconifyIcon icon="material-symbols:text-fields" sx={{ fontSize: 48 }} />
      </Stack>
    </Stack>
  );
};

export default Font;
