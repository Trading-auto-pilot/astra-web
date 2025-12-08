import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import { countries } from 'data/countries';
import IconifyIcon from 'components/base/IconifyIcon';
import PhoneTextfield from 'components/base/PhoneTextfield';
import CountrySelect from 'components/common/CountrySelect';
import AccountDialog from '../common/AccountDialog';
import InfoCard from '../common/InfoCard';
import InfoCardAttribute from '../common/InfoCardAttribute';

const ShippingAddress = () => {
  const [open, setOpen] = useState(false);
  const {
    control,
    getValues,
    setValue,
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [currentAddress, setCurrentAddress] = useState(getValues('shippingAddress'));
  const handleConfirm = async () => {
    const isValid = await trigger('shippingAddress', { shouldFocus: true });
    if (isValid) {
      const shippingData = getValues('shippingAddress');
      setCurrentAddress(shippingData);
      setOpen(false);
      setValue('shippingAddress', shippingData);
    }
  };

  const handleDiscard = () => {
    setValue('shippingAddress', currentAddress);
    setOpen(false);
  };

  return (
    <>
      <InfoCard setOpen={setOpen}>
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
        title="Shipping Address"
        subtitle="Enter your updated address to ensure we have your latest location information."
        handleConfirm={handleConfirm}
        handleDiscard={handleDiscard}
      >
        <Stack direction="column" spacing={2} p={0.125}>
          <TextField
            placeholder="Name"
            label="Name"
            error={!!errors.shippingAddress?.name}
            helperText={errors.shippingAddress?.name?.message}
            fullWidth
            {...register('shippingAddress.name')}
          />
          <Controller
            name="shippingAddress.phoneNumber"
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
            error={!!errors.shippingAddress?.emailAddress}
            helperText={errors.shippingAddress?.emailAddress?.message}
            fullWidth
            {...register('shippingAddress.emailAddress')}
          />
          <Controller
            name="shippingAddress.country"
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
                    error={!!errors.shippingAddress?.country?.message}
                    helperText={errors.shippingAddress?.country?.message}
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
              error={!!errors.shippingAddress?.state}
              helperText={errors.shippingAddress?.state?.message}
              fullWidth
              {...register('shippingAddress.state')}
            />
            <TextField
              placeholder="City"
              label="City"
              error={!!errors.shippingAddress?.city}
              helperText={errors.shippingAddress?.city?.message}
              fullWidth
              {...register('shippingAddress.city')}
            />
          </Stack>
          <Stack direction="column" spacing={1} p={0.125}>
            <TextField
              placeholder="Street"
              label="Street"
              error={!!errors.shippingAddress?.street}
              helperText={errors.shippingAddress?.street?.message}
              fullWidth
              {...register('shippingAddress.street')}
            />
            <TextField
              placeholder="ZIP"
              label="ZIP"
              error={!!errors.shippingAddress?.zip}
              helperText={errors.shippingAddress?.zip?.message}
              fullWidth
              {...register('shippingAddress.zip')}
            />
          </Stack>
        </Stack>
      </AccountDialog>
    </>
  );
};

export default ShippingAddress;
