import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  inputBaseClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import EventDateTimePicker from 'components/sections/calendar/EventDialog/EventDateTimePicker';
import StyledTextField from 'components/styled/StyledTextField';

const CalendarTaskForm = () => {
  const methods = useFormContext();
  const { register, control, watch, setValue, formState } = methods;
  const { errors } = formState;
  const [originalStartTime, setOriginalStartTime] = useState(null);
  const [originalEndTime, setOriginalEndTime] = useState(null);

  const isAllDay = watch('allDay');

  const handleAllDayChange = (checked) => {
    const currentStart = watch('start');
    let currentEnd = watch('end');

    if (!currentEnd || dayjs(currentEnd).isSame(dayjs(currentStart))) {
      currentEnd = dayjs(currentStart).hour(23).minute(59).second(59).toISOString();
    }

    const startString = dayjs(currentStart).toISOString();
    const endString = dayjs(currentEnd).toISOString();

    if (checked) {
      setOriginalStartTime(startString);
      setOriginalEndTime(endString);

      setValue('start', dayjs(currentStart).startOf('day').toISOString());
      setValue('end', dayjs(currentEnd).add(1, 'day').startOf('day').toISOString());
    } else {
      if (originalStartTime && originalEndTime) {
        setValue('start', originalStartTime);
        setValue('end', originalEndTime);
      } else {
        setValue('start', dayjs(currentStart).hour(0).minute(0).second(0).toISOString());
        setValue(
          'end',
          dayjs(currentEnd).subtract(1, 'day').hour(23).minute(59).second(59).toISOString(),
        );
      }
    }

    setValue('allDay', checked);
  };

  return (
    <Stack
      direction="column"
      spacing={3}
      divider={<Divider sx={{ opacity: 0.4 }} />}
      sx={{ mb: 3, pl: 0.5 }}
    >
      <StyledTextField
        fullWidth
        label="Task Title"
        {...register('title', { required: 'Task title is required' })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />

      <Stack direction="column" spacing={2}>
        <Controller
          name="selectedList"
          control={control}
          render={({ field }) => (
            <StyledTextField
              fullWidth
              label="Select List"
              select
              error={!!errors.selectedList}
              helperText={errors.selectedList?.message}
              {...field}
              value={field.value || ''}
            >
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="family">Family</MenuItem>
              <MenuItem value="development">School</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </StyledTextField>
          )}
        />
        <Stack
          spacing={1}
          sx={{
            width: 1,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <Controller
            name="allDay"
            control={control}
            render={({ field: { value } }) => (
              <FormControlLabel
                control={
                  <Switch checked={value} onChange={(e) => handleAllDayChange(e.target.checked)} />
                }
                label="All Day Task"
                sx={{ gap: 1.5, mx: 0, mb: 1, width: 1 }}
              />
            )}
          />
          <Controller
            name="repeated"
            control={control}
            render={({ field }) => (
              <StyledTextField
                fullWidth
                label="Repeat Task"
                select
                error={!!errors.repeated}
                helperText={errors.repeated?.message}
                {...field}
                value={field.value || ''}
              >
                <MenuItem value="none">Does not repeat</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly on selected day</MenuItem>
                <MenuItem value="monthly">Monthly on selected date</MenuItem>
                <MenuItem value="annually">Annually on selected date</MenuItem>
                <MenuItem value="custom">Custom...</MenuItem>
              </StyledTextField>
            )}
          />
        </Stack>
      </Stack>
      <Stack direction="column" spacing={2}>
        <EventDateTimePicker name="start" label="Start" isAllDay={isAllDay} errors={errors} />
        <EventDateTimePicker name="end" label="End" isAllDay={isAllDay} errors={errors} />
      </Stack>
      <StyledTextField
        fullWidth
        label="Add descripton"
        multiline
        rows={3}
        sx={{
          [`& .${inputBaseClasses.root}`]: {
            py: 0.5,
            [`& .${inputBaseClasses.input}`]: {
              py: 0.5,
              px: '10px !important',
            },
          },
        }}
        {...register('description')}
      />
    </Stack>
  );
};

export default CalendarTaskForm;
