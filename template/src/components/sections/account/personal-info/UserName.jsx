import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const userNameSchema = yup.object().shape({
  userName: yup.string().required('User name is required'),
});

const UserName = () => {
  const { personalInfo } = useAccounts();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [currentUserName, setCurrentUserName] = useState(personalInfo.userName);
  const methods = useForm({
    defaultValues: {
      userName: currentUserName,
    },
    resolver: yupResolver(userNameSchema),
  });
  const {
    register,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
    const updatedData = getValues();
    setCurrentUserName(updatedData.userName);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  const handleDiscard = () => {
    reset({ userName: currentUserName });
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen}>
        <Stack direction="column" spacing={{ xs: 2, sm: 1 }} justifyContent="center">
          <InfoCardAttribute label="User Name" value={currentUserName} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="User Name"
        subtitle="Update your username. This change will apply to your account and be visible to others in your interactions."
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
            placeholder="User Name"
            label="User Name"
            error={!!errors.userName}
            helperText={errors.userName?.message}
            fullWidth
            {...register('userName')}
          />
        </Stack>
      </AccountFormDialog>
    </FormProvider>
  );
};

export default UserName;
