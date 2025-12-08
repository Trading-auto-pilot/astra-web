import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, FormControlLabel, Stack, Switch } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const dateTimeSchema = yup.object().shape({
  dateTime: yup.string().required('Date and time is required'),
  options: yup.object().shape({
    setAutomatically: yup.boolean().required(),
    _24hoursTime: yup.boolean().required(),
    show24hoursTime: yup.boolean().required(),
  }),
});

const DateAndTime = () => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      dateTime: '2024-11-13 16:30:24',
      options: {
        setAutomatically: false,
        _24hoursTime: false,
        show24hoursTime: false,
      },
    },
    resolver: yupResolver(dateTimeSchema),
  });
  const {
    control,
    getValues,
    formState: { errors },
  } = methods;
  const { dateTime } = getValues();
  const onSubmit = (data) => {
    console.log({ data });
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success' });
  };

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen} sx={{ mb: 3 }}>
        <Stack direction="column" spacing={1}>
          <InfoCardAttribute
            label="Date and time"
            value={dayjs(dateTime).format('MMM D, YYYY [a]t h:mm:ss A')}
          />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Set Date and Time"
        subtitle="Adjust date, time, and time zone settings to ensure accurate system timestamps."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        sx={{
          maxWidth: 463,
        }}
      >
        <Stack direction="column" spacing={1}>
          <Controller
            control={control}
            name="dateTime"
            render={({ field: { value, onChange, ...rest } }) => (
              <MobileDateTimePicker
                label="Select Date & Time"
                value={dayjs(value)}
                onChange={(value) => onChange(value?.format('YYYY-MM-DD H:mm:ss'))}
                slotProps={{
                  textField: {
                    error: !!errors.dateTime,
                    helperText: errors.dateTime?.message,
                    fullWidth: true,
                  },
                }}
                sx={{ pb: 0.125 }}
                {...rest}
              />
            )}
          />
        </Stack>
      </AccountFormDialog>
      <FormControl component="fieldset" sx={{ gap: 2 }}>
        <Controller
          control={control}
          name="options.setAutomatically"
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} {...field} />}
              label="Set time and date automatically"
              sx={{ gap: 2, ml: 0 }}
            />
          )}
        />
        <Controller
          control={control}
          name="options._24hoursTime"
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} {...field} />}
              label="24-Hours Time"
              sx={{ gap: 2, ml: 0 }}
            />
          )}
        />
        <Controller
          control={control}
          name="options.show24hoursTime"
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} {...field} />}
              label="Show 24-hour time on Lock Screen"
              sx={{ gap: 2, ml: 0 }}
            />
          )}
        />
      </FormControl>
    </FormProvider>
  );
};

export default DateAndTime;
