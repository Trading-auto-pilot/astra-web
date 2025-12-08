import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  inputBaseClasses,
} from '@mui/material';
import { eventCategories } from 'data/calendar';
import dayjs from 'dayjs';
import EventDateTimePicker from 'components/sections/calendar/EventDialog/EventDateTimePicker';
import EventDetailsSection from 'components/sections/calendar/EventDialog/EventDetailsSection';
import StyledTextField from 'components/styled/StyledTextField';

const CalendarEventForm = () => {
  const methods = useFormContext();
  const { register, control, watch, setValue, formState } = methods;
  const { errors } = formState;

  const isAllDay = watch('allDay');
  const eventType = watch('eventType');

  const [originalStartTime, setOriginalStartTime] = useState(null);
  const [originalEndTime, setOriginalEndTime] = useState(null);

  const handleAllDayChange = (checked) => {
    const currentStart = watch('start');
    const currentEnd = watch('end');

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
      <Stack direction="column" spacing={2}>
        <StyledTextField
          fullWidth
          label="Event Title"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
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
                label="All Day Event"
                sx={{ gap: 1.5, mx: 0, mb: 1, width: 1 }}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field: { onChange, value } }) => (
              <StyledTextField
                fullWidth
                select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                label="Event Category"
                error={!!errors.category}
                helperText={errors.category?.message}
              >
                {eventCategories.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                    }}
                  >
                    <Stack
                      spacing={1.5}
                      direction="row"
                      alignItems="center"
                      sx={{
                        width: '100%',
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={(theme) => ({
                          width: 12,
                          height: 12,
                          borderRadius: 0.5,
                          bgcolor: theme.vars.palette[option.color].main,
                          flexShrink: 0,
                        })}
                      />
                      <Box
                        component="span"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}
                      >
                        {option.label}
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </StyledTextField>
            )}
          />
        </Stack>

        <EventDateTimePicker name="start" label="Start" isAllDay={isAllDay} errors={errors} />
        <EventDateTimePicker name="end" label="End" isAllDay={isAllDay} errors={errors} />
      </Stack>

      <EventDetailsSection eventType={eventType} errors={errors} />

      <StyledTextField
        fullWidth
        label="Add note"
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

export default CalendarEventForm;
