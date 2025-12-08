import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import OptionalInfo from './OptionalInfo';
import ProductDimensionInput from './ProductDimensionInput';

export const productInfoFormSchema = yup
  .object({
    productInformation: yup
      .object({
        length: yup.object({
          value: yup
            .number()
            .positive('Value must be a positive number')
            .required('Value is required'),
          unit: yup.string().required('Unit is required'),
        }),
        width: yup.object({
          value: yup
            .number()
            .positive('Value must be a positive number')
            .required('Value is required'),
          unit: yup.string().required('Unit is required'),
        }),
        height: yup.object({
          value: yup
            .number()
            .positive('Value must be a positive number')
            .required('Value is required'),
          unit: yup.string().required('Unit is required'),
        }),
        specifications: yup.array().of(
          yup.object({
            label: yup.string().required('Value is required'),
            value: yup.string().required('Value is required'),
          }),
        ),
      })
      .required(),
  })
  .required();

const ProductInfo = () => {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          mb: 5,
        }}
      >
        <Grid size={12}>
          <Typography variant="subtitle2">
            Required
            <Box
              component="span"
              sx={{
                color: 'error.main',
              }}
            >
              *
            </Box>
          </Typography>
        </Grid>

        <Grid size={12}>
          <ProductDimensionInput field="length" label="Length" />
        </Grid>

        <Grid size={12}>
          <ProductDimensionInput field="width" label="Width" />
        </Grid>

        <Grid size={12}>
          <ProductDimensionInput field="height" label="Height" />
        </Grid>
      </Grid>
      <OptionalInfo />
    </>
  );
};

export default ProductInfo;
