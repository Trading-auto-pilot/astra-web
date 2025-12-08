import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';

export const shippingAddressFormSchema = yup
  .object({
    shippingAddress: yup.object({
      street: yup.string().required('This field is required'),
      townCity: yup.string().required('This field is required'),
      postcode: yup.string().required('This field is required'),
      country: yup.string().required('This field is required'),
      state: yup.string().required('This field is required'),
      differentBillingAddress: yup.boolean(),
    }),
  })
  .required();

const ShippingAddress = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Grid
      container
      columnSpacing={2}
      sx={{
        rowGap: 3,
        my: 3,
      }}
    >
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <TextField
          fullWidth
          id="street"
          type="text"
          label="Street address*"
          variant="filled"
          error={!!errors.shippingAddress?.street}
          helperText={errors.shippingAddress?.street?.message}
          {...register('shippingAddress.street')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <TextField
          fullWidth
          id="townCity"
          type="text"
          label="Town/City*"
          variant="filled"
          error={!!errors.shippingAddress?.townCity}
          helperText={errors.shippingAddress?.townCity?.message}
          {...register('shippingAddress.townCity')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          id="postcode"
          type="text"
          label="Postcode*"
          variant="filled"
          error={!!errors.shippingAddress?.postcode}
          helperText={errors.shippingAddress?.postcode?.message}
          {...register('shippingAddress.postcode')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          id="country"
          type="text"
          label="Country*"
          variant="filled"
          error={!!errors.shippingAddress?.country}
          helperText={errors.shippingAddress?.country?.message}
          {...register('shippingAddress.country')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 4,
        }}
      >
        <TextField
          fullWidth
          id="state"
          type="text"
          label="State*"
          variant="filled"
          error={!!errors.shippingAddress?.state}
          helperText={errors.shippingAddress?.state?.message}
          {...register('shippingAddress.state')}
        />
      </Grid>
      <Grid size={12}>
        <FormControl component="fieldset" variant="filled" sx={{ display: 'block' }}>
          <FormControlLabel
            sx={{ color: 'text.secondary' }}
            control={
              <Controller
                name="shippingAddress.differentBillingAddress"
                control={control}
                defaultValue={false}
                render={({ field }) => <Checkbox {...field} checked={field.value} />}
              />
            }
            label="Use a different billing address"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ShippingAddress;
