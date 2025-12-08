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

const nameSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

const Names = () => {
  const { personalInfo } = useAccounts();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [currentName, setCurrentName] = useState({
    firstName: personalInfo.firstName,
    lastName: personalInfo.lastName,
  });
  const methods = useForm({
    defaultValues: {
      firstName: currentName.firstName,
      lastName: currentName.lastName,
    },
    resolver: yupResolver(nameSchema),
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
    setCurrentName(updatedData);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  const handleDiscard = () => {
    reset({ firstName: currentName.firstName, lastName: currentName.lastName });
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen}>
        <Stack direction="column" spacing={{ xs: 2, sm: 1 }}>
          <InfoCardAttribute label="First Name" value={currentName.firstName} />
          <InfoCardAttribute label="Last Name" value={currentName.lastName} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Name"
        subtitle="Enter your updated first and last name below. Your name will be reflected across all your account settings."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        handleDiscard={handleDiscard}
        sx={{ maxWidth: 463 }}
      >
        <Stack direction="column" spacing={1} p={0.125}>
          <TextField
            placeholder="First Name"
            label="First Name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            {...register('firstName')}
          />
          <TextField
            placeholder="Last Name"
            label="Last Name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            {...register('lastName')}
          />
        </Stack>
      </AccountFormDialog>
    </FormProvider>
  );
};

export default Names;
