import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { closestCities, timezones } from 'data/account/date-time';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const timezoneSchema = yup.object().shape({
  autoSetTimeZone: yup.boolean().required(),
  timezone: yup.string().required('Timezone is required'),
  closestCity: yup.string().required('Closest city is required'),
});

const Timezone = () => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      autoSetTimeZone: false,
      timezone: 'Eastern Standard Time',
      closestCity: 'Montreal, QC, Canada (GMT-5)',
    },
    resolver: yupResolver(timezoneSchema),
  });
  const {
    control,
    getValues,
    formState: { errors },
  } = methods;
  const { timezone, closestCity } = getValues();
  const onSubmit = (data) => {
    console.log({ data });
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success' });
  };

  return (
    <FormProvider {...methods}>
      <FormControl component="fieldset" sx={{ gap: 2, mb: 3 }}>
        <Controller
          control={control}
          name="autoSetTimeZone"
          render={({ field }) => (
            <FormControlLabel
              control={<Switch checked={field.value} {...field} />}
              label="Auto-Set Time Zone Based on Location"
              sx={{ gap: 2, ml: 0 }}
            />
          )}
        />
      </FormControl>
      <InfoCard setOpen={setOpen}>
        <Stack direction="column" spacing={1}>
          <InfoCardAttribute label="Time zone" value={timezone} />
          <InfoCardAttribute label="Closest city" value={closestCity} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Set Regional Settings"
        subtitle="Set your time zone and regional preferences to match your closest city."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        sx={{
          maxWidth: 463,
        }}
      >
        <Stack direction="column" spacing={1} p={0.125}>
          <Controller
            name="timezone"
            control={control}
            render={({ field }) => (
              <Autocomplete
                aria-labelledby="timezone-autocomplete-label"
                disablePortal
                options={timezones}
                {...field}
                onChange={(_, value) => {
                  field.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Time Zone"
                    placeholder="Select time zone"
                    error={!!errors.timezone}
                    helperText={errors.timezone?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="closestCity"
            control={control}
            render={({ field }) => (
              <Autocomplete
                aria-labelledby="closest-city-autocomplete-label"
                disablePortal
                options={closestCities}
                {...field}
                onChange={(_, value) => {
                  field.onChange(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Closest city"
                    placeholder="Select city"
                    error={!!errors.closestCity}
                    helperText={errors.closestCity?.message}
                  />
                )}
              />
            )}
          />
        </Stack>
      </AccountFormDialog>
    </FormProvider>
  );
};

export default Timezone;
