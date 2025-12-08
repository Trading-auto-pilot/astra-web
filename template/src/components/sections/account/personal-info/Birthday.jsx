import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const birthdaySchema = yup.object().shape({
  birthDate: yup.string().required('Birth date is required'),
});

const Birthday = () => {
  const [open, setOpen] = useState(false);
  const { personalInfo } = useAccounts();
  const { up } = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();
  const [currentBirthDate, setCurrentBirthDate] = useState(personalInfo.birthDate);
  const methods = useForm({
    defaultValues: {
      birthDate: currentBirthDate,
      visibility: 'only_me',
    },
    resolver: yupResolver(birthdaySchema),
  });
  const {
    control,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  const upSm = up('sm');

  const onSubmit = (data) => {
    console.log(data);
    const updatedData = getValues();
    setCurrentBirthDate(updatedData.birthDate);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };
  const handleDiscard = () => {
    reset({ birthDate: currentBirthDate });
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen} sx={{ mb: 3 }}>
        <Stack direction="column" spacing={{ xs: 2, sm: 1 }}>
          <InfoCardAttribute label="Date" value={dayjs(currentBirthDate).format('D MMMM, YYYY')} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Birthday"
        subtitle="Provide your birthday to ensure you get the right content and features for your age."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        handleDiscard={handleDiscard}
        sx={{
          maxWidth: 463,
        }}
      >
        <Stack direction={{ xs: 'column' }} spacing={1}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { value, ...rest } }) => (
              <DatePicker
                label="Select Birth date"
                value={dayjs(value)}
                slotProps={{
                  textField: {
                    error: !!errors.birthDate,
                    helperText: errors.birthDate?.message,
                    fullWidth: true,
                  },
                  inputAdornment: {
                    position: 'start',
                  },
                }}
                {...rest}
              />
            )}
          />
        </Stack>
      </AccountFormDialog>
      <FormControl sx={{ gap: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
          Who can see your birthday?
        </Typography>
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <RadioGroup row={upSm} aria-labelledby="birthday-visibility-radio-buttons" {...field}>
              <FormControlLabel value="only_me" control={<Radio />} label="Only me" />
              <FormControlLabel value="followers_only" control={<Radio />} label="Followers only" />
              <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
            </RadioGroup>
          )}
        />
      </FormControl>
    </FormProvider>
  );
};

export default Birthday;
