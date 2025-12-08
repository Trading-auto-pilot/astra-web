import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Divider, FormControlLabel, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import * as yup from 'yup';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import BillingAddress from './BillingAddress';
import ShippingAddress from './ShippingAddress';

const shippingBillingAddressSchema = yup.object().shape({
  shippingAddress: yup.object().shape({
    name: yup.string().required('Name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    emailAddress: yup.string().email().required('Country name is required'),
    country: yup.string().required('Country name is required'),
    state: yup.string().required('State name is required'),
    city: yup.string().required('City name is required'),
    street: yup.string().required('Street name is required'),
    zip: yup.string().required('ZIP is required'),
    addressType: yup.string().required('Office type is required'),
  }),
  billingAddress: yup.object().shape({
    name: yup.string().required('Name is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    emailAddress: yup.string().email().required('Country name is required'),
    country: yup.string().required('Country name is required'),
    state: yup.string().required('State name is required'),
    city: yup.string().required('City name is required'),
    street: yup.string().required('Street name is required'),
    zip: yup.string().required('ZIP is required'),
    addressType: yup.string().required('Office type is required'),
  }),
});

const ShippingBillingAddressTabPanel = () => {
  const { shippingBillingAddress } = useAccounts();
  const methods = useForm({
    defaultValues: shippingBillingAddress,
    resolver: yupResolver(shippingBillingAddressSchema),
  });

  const { handleSubmit, watch, setValue, resetField } = methods;

  const { shippingAddress } = watch();

  const { enqueueSnackbar } = useSnackbar();

  const [defaultShippingAddress, setDefaultShippingAddress] = useState(false);

  useEffect(() => {
    if (defaultShippingAddress) {
      setValue('billingAddress', shippingAddress);
    } else {
      resetField('billingAddress');
    }
  }, [defaultShippingAddress]);

  const onSubmit = (data) => {
    console.log({ data });
    enqueueSnackbar('Updated successfully!', { variant: 'success' });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        direction="column"
        divider={<Divider />}
        spacing={4}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AccountTabPanelSection
          title="Shipping Address"
          subtitle="You can edit your address and control who can see it."
          icon="material-symbols:local-shipping-outline-rounded"
        >
          <ShippingAddress />
        </AccountTabPanelSection>
        <AccountTabPanelSection
          title="Billing Address"
          icon="material-symbols:receipt-long-outline-rounded"
          actionComponent={
            <FormControlLabel
              control={
                <Checkbox
                  checked={defaultShippingAddress}
                  onChange={(e) => setDefaultShippingAddress(e.target.checked)}
                />
              }
              label="Set as default shipping address"
            />
          }
        >
          <BillingAddress defaultShippingAddress={defaultShippingAddress} />
          <Stack justifyContent="flex-end" spacing={1}>
            <Button variant="soft" color="neutral" sx={{ width: 100 }}>
              Discard
            </Button>
            <Button type="submit" variant="contained" sx={{ width: 100 }}>
              Save
            </Button>
          </Stack>
        </AccountTabPanelSection>
      </Stack>
    </FormProvider>
  );
};

export default ShippingBillingAddressTabPanel;
