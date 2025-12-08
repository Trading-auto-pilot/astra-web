import { Controller, useFormContext } from 'react-hook-form';
import {
  Box,
  FormControl,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  useTheme,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { eventCategories } from 'data/project/dashboard';
import dayjs from 'dayjs';
import StyledTextField from 'components/styled/StyledTextField';

const EventTitleTime = () => {
  const { vars } = useTheme();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack direction="column" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <StyledTextField
        label="Title"
        fullWidth
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
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
          name="allDayEvent"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    if (e.target.checked) {
                      setValue('startTime', '12:00 am');
                      setValue('endTime', '11:59 pm');
                    } else {
                      setValue('startTime', dayjs().format('h:mm a'));
                      setValue('endTime', dayjs().format('h:mm a'));
                    }
                  }}
                />
              }
              label="All day event"
              sx={{ gap: 1.5, mx: 0, mb: 1, width: 1 }}
            />
          )}
        />
        <FormControl fullWidth>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <StyledTextField select label="Category" {...field}>
                {eventCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: 0.5,
                          bgcolor: vars.palette[option.color].main,
                        }}
                      />
                      {option.label}
                    </Stack>
                  </MenuItem>
                ))}
              </StyledTextField>
            )}
          />
        </FormControl>
      </Stack>
      <Stack spacing={1} sx={{ width: 1 }}>
        <Stack direction="column" spacing={1} sx={{ width: 1 }}>
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Starts at"
                value={dayjs(value, 'DD.MM.YYYY')}
                format="DD.MM.YYYY"
                onChange={onChange}
                slots={{
                  textField: StyledTextField,
                }}
                slotProps={{
                  textField: {
                    error: !!errors.startDate,
                    helperText: errors.startDate?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TimePicker
                value={dayjs(`${dayjs().format('DD.MM.YYYY')} ${value}`, 'DD.MM.YYYY h:mm a')}
                format="h:mm a"
                onChange={(date) => onChange(date?.format('h:mm a'))}
                slots={{
                  textField: StyledTextField,
                }}
                slotProps={{
                  textField: {
                    error: !!errors.startTime,
                    helperText: errors.startTime?.message,
                  },
                }}
              />
            )}
          />
        </Stack>
        <Stack direction="column" spacing={1} sx={{ width: 1 }}>
          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Ends at"
                value={dayjs(value, 'DD.MM.YYYY')}
                format="DD.MM.YYYY"
                onChange={onChange}
                slots={{
                  textField: StyledTextField,
                }}
                slotProps={{
                  textField: {
                    error: !!errors.endDate,
                    helperText: errors.endDate?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TimePicker
                value={dayjs(`${dayjs().format('DD.MM.YYYY')} ${value}`, 'DD.MM.YYYY h:mm a')}
                format="h:mm a"
                onChange={(date) => onChange(date?.format('h:mm a'))}
                slots={{
                  textField: StyledTextField,
                }}
                slotProps={{
                  textField: {
                    error: !!errors.endTime,
                    helperText: errors.endTime?.message,
                  },
                }}
              />
            )}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EventTitleTime;
