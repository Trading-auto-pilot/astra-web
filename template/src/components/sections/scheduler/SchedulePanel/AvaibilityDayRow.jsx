import { FormControlLabel, FormGroup, IconButton, Stack, Switch, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import TimeSlotControl from './TimeSlotControl';

const AvailabilityDayRow = ({
  dayIndex,
  day,
  onToggleDay,
  onAddSlot,
  onRemoveSlot,
  onTimeChange,
  timeOptions,
}) => {
  return (
    <FormGroup key={day.id} row sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <FormControlLabel
        control={
          <Switch size="small" checked={!day.disabled} onChange={() => onToggleDay(dayIndex)} />
        }
        label={<Typography variant="subtitle2">{day.day}</Typography>}
        sx={{ mx: 0, gap: 1, flexGrow: 1 }}
      />

      <Stack spacing={1}>
        <IconButton size="small" disabled={day.disabled} onClick={() => onAddSlot(dayIndex)}>
          <IconifyIcon
            icon="material-symbols:add-rounded"
            color={day.disabled ? 'text.disabled' : 'text.primary'}
          />
        </IconButton>
      </Stack>

      {!day.disabled && (
        <Stack spacing={1} direction="column" sx={{ mt: 1.5, width: 1, flexGrow: 1 }}>
          {day.timeSlots.map((slot, slotIndex) => (
            <TimeSlotControl
              key={slot.id}
              dayIndex={dayIndex}
              slotIndex={slotIndex}
              slotId={slot.id}
              disabled={day.disabled}
              onTimeChange={onTimeChange}
              onRemoveSlot={onRemoveSlot}
              timeOptions={timeOptions}
            />
          ))}
        </Stack>
      )}
    </FormGroup>
  );
};

export default AvailabilityDayRow;
