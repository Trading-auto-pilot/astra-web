import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, InputAdornment, Stack, TextField } from '@mui/material';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import EventDayTimePicker from 'components/sections/events/create-event/main/EventDayTimePicker';

const EventOverview = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Stack spacing={1} direction="column">
      <TextField
        fullWidth
        multiline
        rows={3}
        id="name"
        type="text"
        label="Event Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name')}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="address"
        type="text"
        label="Location"
        variant="filled"
        error={!!errors.address}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon icon="material-symbols:location-on-outline" />
              </InputAdornment>
            ),
          },
        }}
        helperText={errors.address?.message}
        {...register('address')}
      />
      <FormControl fullWidth error={!!errors.eventDateRange} sx={{ mb: 1 }}>
        <Controller
          name="eventDateRange"
          control={control}
          render={({ field }) => (
            <DateRangePicker
              selected={field.value?.[0] || undefined}
              startDate={field.value?.[0] || undefined}
              endDate={field.value?.[1] || undefined}
              onChange={(dates) => {
                field.onChange(dates);
              }}
              isClearable
              customInput={
                <TextField
                  label="Select Date Range"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:calendar-month-outline-rounded" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              }
            />
          )}
        />

        {errors.eventDateRange && <FormHelperText>{errors.eventDateRange?.message}</FormHelperText>}
      </FormControl>
      <EventDayTimePicker
        dayLabel="Day 1"
        startTimeName="startTime1"
        endTimeName="endTime1"
        errors={errors}
        control={control}
      />

      <EventDayTimePicker
        dayLabel="Day 2"
        startTimeName="startTime2"
        endTimeName="endTime2"
        errors={errors}
        control={control}
      />
    </Stack>
  );
};

export default EventOverview;
