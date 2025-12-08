import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const emailSchema = yup.object().shape({
  primaryEmail: yup
    .string()
    .email('Primary email must be a valid email')
    .required('Primary email is required'),
  secondaryEmail: yup
    .string()
    .email('Secondary email must be a valid email')
    .required('Secondary email is required'),
});

const Email = () => {
  const [open, setOpen] = useState(false);
  const { personalInfo } = useAccounts();
  const { enqueueSnackbar } = useSnackbar();
  const [currentEmail, setCurrentEmail] = useState({
    primaryEmail: personalInfo.primaryEmail,
    secondaryEmail: personalInfo.secondaryEmail,
  });
  const methods = useForm({
    defaultValues: {
      primaryEmail: personalInfo.primaryEmail,
      secondaryEmail: personalInfo.secondaryEmail,
    },
    resolver: yupResolver(emailSchema),
  });
  const {
    getValues,
    register,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    const updatedData = getValues();
    setCurrentEmail(updatedData);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  const handleDiscard = () => {
    reset(currentEmail);
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen} sx={{ mb: 2 }}>
        <Stack direction="column" spacing={{ xs: 2, sm: 1 }}>
          <InfoCardAttribute label="Primary Email" value={currentEmail.primaryEmail} />
          <InfoCardAttribute label="Secondary Email" value={currentEmail.secondaryEmail} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Email Address"
        subtitle="Update your primary email address. You can also set an alternate email address for extra security and backup."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        handleDiscard={handleDiscard}
        sx={{
          maxWidth: 463,
        }}
      >
        <Stack direction="column" spacing={1} p={0.125}>
          <TextField
            placeholder="Primary Email"
            label="Primary Email"
            error={!!errors.primaryEmail}
            helperText={errors.primaryEmail?.message}
            fullWidth
            {...register('primaryEmail')}
          />
          <TextField
            placeholder="Secondary Email"
            label="Secondary Email"
            error={!!errors.secondaryEmail}
            helperText={errors.secondaryEmail?.message}
            fullWidth
            {...register('secondaryEmail')}
          />
        </Stack>
      </AccountFormDialog>
      <Stack spacing={1} sx={{ color: 'info.main' }}>
        <IconifyIcon icon="material-symbols:info" sx={{ fontSize: 24 }} />
        <Typography variant="body2">
          Your alternate email will be used to gain access to your account if you ever have issues
          with logging in with your primary email.
        </Typography>
      </Stack>
    </FormProvider>
  );
};

export default Email;
