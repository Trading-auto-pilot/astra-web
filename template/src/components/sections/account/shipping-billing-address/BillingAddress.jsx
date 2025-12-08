import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import { countries } from 'data/countries';
import IconifyIcon from 'components/base/IconifyIcon';
import PhoneTextfield from 'components/base/PhoneTextfield';
import CountrySelect from 'components/common/CountrySelect';
import AccountDialog from '../common/AccountDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const BillingAddress = ({ defaultShippingAddress }) => {
  const [open, setOpen] = useState(false);
  const {
    watch,
    control,
    register,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [currentAddress, setCurrentAddress] = useState(getValues('billingAddress'));
  const billingAddress = watch('billingAddress');

  useEffect(() => setCurrentAddress(billingAddress), [billingAddress]);

  const handleConfirm = async () => {
    const isValid = await trigger('billingAddress');
    console.log(isValid);
    if (isValid) {
      const billingData = getValues('billingAddress');
      setCurrentAddress(billingData);
      setOpen(false);
      setValue('billingAddress', billingData);
    }
  };

  const handleDiscard = () => {
    setValue('billingAddress', currentAddress);
    setOpen(false);
  };

  return (
    <>
      <InfoCard setOpen={!defaultShippingAddress ? setOpen : null} sx={{ mb: 5 }}>
        <Stack direction="column" spacing={2}>
          <InfoCardAttribute label="Name" value={currentAddress.name} />
          <InfoCardAttribute label="Phone Number" value={currentAddress.phoneNumber} />
          <InfoCardAttribute label="Email Address" value={currentAddress.emailAddress} />
          <InfoCardAttribute label="Country" value={currentAddress.country} />
          <InfoCardAttribute label="State" value={currentAddress.state} />
          <InfoCardAttribute label="City" value={currentAddress.city} />
          <InfoCardAttribute label="Street" value={currentAddress.street} />
          <InfoCardAttribute label="ZIP" value={currentAddress.zip} />
          <InfoCardAttribute label="Type of Address" value={currentAddress.addressType} />
        </Stack>
        <IconifyIcon
          icon="material-symbols-light:edit-outline"
          sx={{ fontSize: 20, color: 'neutral.dark', visibility: 'hidden' }}
        />
      </InfoCard>
      <AccountDialog
        open={open}
        handleDialogClose={() => setOpen(false)}
        title="Billing Address"
        subtitle="Enter your updated address to ensure we have your latest location information."
        handleConfirm={handleConfirm}
        handleDiscard={handleDiscard}
      >
        <Stack direction="column" spacing={2} p={0.125}>
          <TextField
            placeholder="Name"
            label="Name"
            error={!!errors.billingAddress?.name}
            helperText={errors.billingAddress?.name?.message}
            fullWidth
            {...register('billingAddress.name')}
          />
          <Controller
            name="billingAddress.phoneNumber"
            control={control}
            render={({ field: { onChange } }) => (
              <PhoneTextfield
                onChange={onChange}
                defaultValue={{
                  code: '880',
                  number: '1234567890',
                }}
              />
            )}
          />
          <TextField
            placeholder="Email"
            label="Email address"
            error={!!errors.billingAddress?.emailAddress}
            helperText={errors.billingAddress?.emailAddress?.message}
            fullWidth
            {...register('billingAddress.emailAddress')}
          />
          <Controller
            name="billingAddress.country"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CountrySelect
                sx={{ mb: 1 }}
                fullWidth
                onChange={(_, value) => onChange(value ? value.label : '')}
                value={countries.find((country) => country.label === value) || null}
                renderInput={(params) => (
                  <TextField
                    label="Country"
                    error={!!errors.billingAddress?.country?.message}
                    helperText={errors.billingAddress?.country?.message}
                    {...params}
                  />
                )}
              />
            )}
          />
          <Stack direction="column" spacing={1} p={0.125}>
            <TextField
              placeholder="State"
              label="State"
              error={!!errors.billingAddress?.state}
              helperText={errors.billingAddress?.state?.message}
              fullWidth
              {...register('billingAddress.state')}
            />
            <TextField
              placeholder="City"
              label="City"
              error={!!errors.billingAddress?.city}
              helperText={errors.billingAddress?.city?.message}
              fullWidth
              {...register('billingAddress.city')}
            />
          </Stack>
          <Stack direction="column" spacing={1} p={0.125}>
            <TextField
              placeholder="Street"
              label="Street"
              error={!!errors.billingAddress?.street}
              helperText={errors.billingAddress?.street?.message}
              fullWidth
              {...register('billingAddress.street')}
            />
            <TextField
              placeholder="ZIP"
              label="ZIP"
              error={!!errors.billingAddress?.zip}
              helperText={errors.billingAddress?.zip?.message}
              fullWidth
              {...register('billingAddress.zip')}
            />
          </Stack>
        </Stack>
      </AccountDialog>
    </>
  );
};

export default BillingAddress;
