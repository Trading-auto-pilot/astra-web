import { Controller, useFormContext } from 'react-hook-form';
import { IconButton, Stack, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const TimeSlotControl = ({ dayIndex, slotIndex, slotId, disabled, onTimeChange, onRemoveSlot }) => {
  const { control } = useFormContext();

  return (
    <Stack key={slotId} direction="row" alignItems="center" spacing={1}>
      <Controller
        name={`availability.${dayIndex}.timeSlots.${slotIndex}.start`}
        control={control}
        render={({ field, fieldState }) => (
          <TimePicker
            slots={{ textField: StyledTextField }}
            ampm={false}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: !!fieldState.error,
              },
            }}
            value={field.value ? dayjs(field.value, 'HH:mm') : null}
            onChange={(newValue) => {
              const formatted = newValue ? dayjs(newValue).format('HH:mm') : '';
              field.onChange(formatted);
              onTimeChange(dayIndex, slotIndex, 'start', formatted);
            }}
          />
        )}
      />

      <Typography variant="subtitle2">to</Typography>

      <Controller
        name={`availability.${dayIndex}.timeSlots.${slotIndex}.end`}
        control={control}
        render={({ field, fieldState }) => (
          <TimePicker
            ampm={false}
            slots={{ textField: StyledTextField }}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: !!fieldState.error,
              },
            }}
            value={field.value ? dayjs(field.value, 'HH:mm') : null}
            onChange={(newValue) => {
              const formatted = newValue ? dayjs(newValue).format('HH:mm') : '';
              field.onChange(formatted);
              onTimeChange(dayIndex, slotIndex, 'end', formatted);
            }}
          />
        )}
      />

      <IconButton size="small" onClick={() => onRemoveSlot(slotId)} disabled={disabled}>
        <IconifyIcon icon="material-symbols:remove-rounded" color="text.primary" />
      </IconButton>
    </Stack>
  );
};

export default TimeSlotControl;
