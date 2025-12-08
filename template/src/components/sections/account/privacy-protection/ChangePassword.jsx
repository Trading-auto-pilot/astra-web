import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import PasswordTextField from 'components/common/PasswordTextField';
import AccountFormDialog from '../common/AccountFormDialog';

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Your passwords do not match.'),
});
const ChangePassword = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm({
    resolver: yupResolver(passwordSchema),
  });
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  return (
    <FormProvider {...methods}>
      <Stack direction="column" spacing={2} alignItems="flex-start">
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'info.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconifyIcon icon="material-symbols:info-outline" sx={{ fontSize: 24 }} />
          Your password was last updated on 07/08/22
        </Typography>
        <Button
          variant="soft"
          color="neutral"
          onClick={() => setOpen(true)}
          endIcon={<IconifyIcon icon="material-symbols:chevron-right" sx={{ fontSize: 20 }} />}
        >
          Change password
        </Button>
        <AccountFormDialog
          title="Set New Password"
          subtitle="Create a new password for your account. New password must be different from any previous passwords."
          open={open}
          handleDialogClose={() => setOpen(false)}
          onSubmit={onSubmit}
          sx={{
            maxWidth: 463,
          }}
        >
          <Stack direction="column" spacing={1} pb={0.125}>
            <PasswordTextField
              placeholder="Current password"
              label="Current password"
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <PasswordTextField
              placeholder="New password"
              label="New password"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <PasswordTextField
              placeholder="Retype new password"
              label="Retype password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </Stack>
        </AccountFormDialog>
      </Stack>
    </FormProvider>
  );
};

export default ChangePassword;
