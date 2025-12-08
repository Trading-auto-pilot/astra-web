import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import Category from './CategorySelect';

export const vitalInfoFormSchema = yup
  .object({
    vitalInfo: yup.object({
      productId: yup.string().required('This field is required'),
      productIdType: yup.string().required('This field is required'),
      category: yup.string().required('This field is required'),
      title: yup.string().required('This field is required'),
      brand: yup.string().required('This field is required'),
      manufacturer: yup.string().required('This field is required'),
      mfrNumber: yup.string().required('This field is required'),
    }),
  })
  .required();

const VitalInfo = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <TextField
          fullWidth
          id="productId"
          type="text"
          label="Product ID"
          variant="filled"
          error={!!errors.vitalInfo?.productId}
          helperText={errors.vitalInfo?.productId?.message}
          {...register('vitalInfo.productId')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <FormControl variant="filled" fullWidth error={!!errors.vitalInfo?.productIdType}>
          <InputLabel id="productID-type-label">Product ID type</InputLabel>

          <Controller
            name="vitalInfo.productIdType"
            control={control}
            defaultValue="upc"
            render={({ field }) => (
              <Select
                labelId="productID-type-label"
                label="Product ID type"
                {...field}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="upc">UPC</MenuItem>
                <MenuItem value="ean">EAN</MenuItem>
                <MenuItem value="gcid">GCID</MenuItem>
              </Select>
            )}
          />

          <FormHelperText>{errors.vitalInfo?.productIdType?.message}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
          }}
        >
          To list your products you require a unique identifier for your product such as UPC, EAN,
          or GCID. You can request exemptions to list products that do not have standard product IDs
          for certain categories{' '}
          <Link
            href="#!"
            sx={{
              fontWeight: 700,
            }}
          >
            Learn more
          </Link>
        </Typography>
      </Grid>

      <Grid size={12}>
        <Category />
      </Grid>

      <Grid size={12}>
        <TextField
          fullWidth
          id="title"
          type="text"
          label="Title"
          variant="filled"
          error={!!errors.vitalInfo?.title}
          helperText={errors.vitalInfo?.title?.message}
          {...register('vitalInfo.title')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          id="brand"
          type="text"
          label="Brand"
          variant="filled"
          error={!!errors.vitalInfo?.brand}
          helperText={errors.vitalInfo?.brand?.message}
          {...register('vitalInfo.brand')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          id="manufacturer"
          type="text"
          label="Manufacturer"
          variant="filled"
          error={!!errors.vitalInfo?.manufacturer}
          helperText={errors.vitalInfo?.manufacturer?.message}
          {...register('vitalInfo.manufacturer')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          id="mfrNumber"
          type="text"
          label="MFR part number"
          variant="filled"
          error={!!errors.vitalInfo?.mfrNumber}
          helperText={errors.vitalInfo?.mfrNumber?.message}
          {...register('vitalInfo.mfrNumber')}
        />
      </Grid>
    </Grid>
  );
};

export default VitalInfo;
