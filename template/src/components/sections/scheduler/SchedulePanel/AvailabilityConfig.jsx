import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import AvailabilityDayRow from 'components/sections/scheduler/SchedulePanel/AvaibilityDayRow';
import { useAvailabilityConfig } from 'components/sections/scheduler/SchedulePanel/useAvailiabilityConfig';
import SettingsToggle from 'components/sections/scheduler/SettingsToggle';
import StyledTextField from 'components/styled/StyledTextField';

const AvailabilityConfig = ({ onAddSlot, onUpdateSlot, onRemoveSlot }) => {
  const { availabilityFields, handleToggleDay, handleAddSlot, handleRemoveSlot, handleTimeChange } =
    useAvailabilityConfig(onAddSlot, onUpdateSlot, onRemoveSlot);

  const { control } = useFormContext();

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 60) {
        times.push(dayjs().hour(hour).minute(minute).format('HH:mm'));
      }
    }

    return times;
  };

  const TIME_OPTIONS = generateTimeOptions();

  return (
    <SettingsToggle
      title="General Availability"
      icon="material-symbols:work-history-outline"
      defaultOpen
    >
      <FormControl sx={{ gap: 2, width: 1 }}>
        <Controller
          name="repeatedAppointment"
          control={control}
          render={({ field }) => (
            <StyledTextField {...field} fullWidth label="Repeated Appointment" select>
              <MenuItem value="none">Does not repeat</MenuItem>
              <MenuItem value="daily">Repeated Daily</MenuItem>
              <MenuItem value="weekly">Repeated Weekly</MenuItem>
              <MenuItem value="monthly">Repeated Monthly</MenuItem>
            </StyledTextField>
          )}
        />

        {availabilityFields.map((day, index) => (
          <AvailabilityDayRow
            key={day.id}
            dayIndex={index}
            day={day}
            onToggleDay={handleToggleDay}
            onAddSlot={handleAddSlot}
            onRemoveSlot={handleRemoveSlot}
            onTimeChange={handleTimeChange}
            timeOptions={TIME_OPTIONS}
          />
        ))}
      </FormControl>
    </SettingsToggle>
  );
};

export default AvailabilityConfig;
