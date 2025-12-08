import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import PhoneTextfield from 'components/base/PhoneTextfield';
import AccountFormDialog from '../common/AccountFormDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const phoneSchema = yup
  .object({
    phoneNumber: yup.string().required('Phone number is required'),
  })
  .required();

const Phone = () => {
  const [open, setOpen] = useState(false);
  const { personalInfo } = useAccounts();
  const { enqueueSnackbar } = useSnackbar();
  const [currentPhone, setCurrentPhone] = useState(personalInfo.phoneNumber);
  const methods = useForm({
    defaultValues: {
      phoneNumber: currentPhone,
    },
    resolver: yupResolver(phoneSchema),
  });
  const { control, reset, getValues } = methods;

  const onSubmit = (data) => {
    console.log(data);
    const updatedData = getValues();
    setCurrentPhone(updatedData.phoneNumber);
    setOpen(false);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };
  const handleDiscard = () => {
    reset({ phoneNumber: currentPhone });
    setOpen(false);
  };
  const match = currentPhone.match(/\(\+(\d+)\)(\d+)/);

  return (
    <FormProvider {...methods}>
      <InfoCard setOpen={setOpen} sx={{ mb: 2 }}>
        <Stack direction="column" spacing={{ xs: 2, sm: 1 }}>
          <InfoCardAttribute label="Number" value={currentPhone} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountFormDialog
        title="Phone"
        subtitle="Ensure your phone number to enable account recovery and receive important notifications."
        open={open}
        onSubmit={onSubmit}
        handleDialogClose={() => setOpen(false)}
        handleDiscard={handleDiscard}
        sx={{
          maxWidth: 463,
        }}
      >
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field: { onChange } }) => (
            <PhoneTextfield
              onChange={onChange}
              defaultValue={{
                code: match?.[1],
                number: match?.[2],
              }}
            />
          )}
        />
      </AccountFormDialog>
      <Stack direction="column" spacing={1} alignItems="flex-start">
        <Typography variant="body2" sx={{ color: 'text.secondary', textWrap: 'pretty' }}>
          This phone number has to be confirmed to ensure its authenticity first before being
          connected with your profile.
        </Typography>
        <Link
          href="#!"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'body2.fontSize',
          }}
        >
          Confirm your number{' '}
          <IconifyIcon icon="material-symbols:chevron-right" sx={{ fontSize: 20 }} />
        </Link>
      </Stack>
    </FormProvider>
  );
};

export default Phone;
