import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { countries } from 'data/countries';
import { hsCodeList } from 'data/e-commerce/product-listing';
import * as yup from 'yup';

export const ShippingFormSchema = yup.object().shape({
  shippingDetails: yup.object().shape({
    isPhysicalProduct: yup.boolean(),
    weight: yup
      .object()
      .shape({
        value: yup.number(),
        unit: yup.string(),
      })
      .when('isPhysicalProduct', {
        is: true,
        then: (schema) =>
          schema.shape({
            value: yup
              .number()
              .required('Value is required')
              .positive('Value must be a positive number'),
            unit: yup.string().required('Weight unit is required'),
          }),
      }),
    country: yup.string().required('This field is required'),
    hsCode: yup
      .object()
      .shape({
        code: yup.string().required('HS Code is required'),
      })
      .required('This field is required'),
  }),
});

const Shipping = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  console.log({ errors });

  const isPhysicalProduct = useWatch({ control, name: 'shippingDetails.isPhysicalProduct' });

  return (
    <>
      <Grid
        container
        sx={{
          gap: 5,
        }}
      >
        <Grid size={12}>
          <FormControl
            component="fieldset"
            variant="filled"
            error={!!errors.shippingDetails?.isPhysicalProduct?.message}
          >
            <FormControlLabel
              control={
                <Controller
                  name="shippingDetails.isPhysicalProduct"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
              }
              label="This is a physical product"
            />
          </FormControl>

          {isPhysicalProduct && (
            <Box
              sx={{
                mt: 4,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                }}
              >
                Weight
              </Typography>
              <Typography
                component="p"
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                Used to calculate shipping rates at checkout and label prices during fulfillment.
              </Typography>
              <Stack
                sx={{
                  gap: 1,
                }}
              >
                <TextField
                  label="Weight"
                  variant="filled"
                  sx={{ width: 100 }}
                  error={!!errors.shippingDetails?.weight?.value}
                  helperText={errors.shippingDetails?.weight?.value?.message}
                  {...register('shippingDetails.weight.value', {
                    setValueAs: (value) => Number(value),
                  })}
                />
                <FormControl variant="filled">
                  <InputLabel id="weight-unit-label">Unit</InputLabel>
                  <Controller
                    name="shippingDetails.weight.unit"
                    control={control}
                    defaultValue="kg"
                    render={({ field }) => (
                      <Select labelId="weight-unit-label" sx={{ width: 80 }} {...field}>
                        <MenuItem value="kg">kg</MenuItem>
                        <MenuItem value="lb">lb</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.shippingDetails?.weight?.unit?.message}</FormHelperText>
                </FormControl>
              </Stack>
            </Box>
          )}
        </Grid>

        <Grid size={12}>
          <Controller
            name="shippingDetails.country"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="country-select"
                sx={{ width: 1, maxWidth: 410, mb: 2 }}
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                onChange={(_, value) => field.onChange(value ? value.label : '')}
                value={countries.find((country) => country.label === field.value) || null}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;

                  return (
                    <Box key={key} component="li" {...optionProps}>
                      {option.label} ({option.code})
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    label="Select country/ region"
                    error={!!errors.shippingDetails?.country?.message}
                    helperText={errors.shippingDetails?.country?.message}
                    {...params}
                  />
                )}
              />
            )}
          />
          <Controller
            name="shippingDetails.hsCode"
            control={control}
            render={({ field }) => (
              <Autocomplete
                id="hscode-select"
                sx={{ width: 1, maxWidth: 410, mb: 2 }}
                options={hsCodeList}
                autoHighlight
                getOptionLabel={(option) => String(option.code)}
                isOptionEqualToValue={(option, value) => option.code === value.code}
                onChange={(_, value) => field.onChange(value)}
                value={field.value || null}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Stack sx={{ alignItems: 'flex-start' }}>
                      <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold' }}>
                        {option.code}
                      </Typography>
                      {' - '}
                      {option.desc}
                    </Stack>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    label="Enter a HS code"
                    error={!!errors.shippingDetails?.hsCode?.message}
                    helperText={errors.shippingDetails?.hsCode?.message}
                    {...params}
                  />
                )}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Shipping;
