import { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';

export const productInventoryFormSchema = yup.object({
  inventories: yup
    .array()
    .of(
      yup
        .object({
          variant: yup.string().required('This field is required'),
          sku: yup.string().required('This field is required'),
          barcode: yup.string().required('This field is required'),
        })
        .required(),
    )
    .required(),
  inventoryDetails: yup
    .object({
      trackQuantity: yup.boolean(),
      sellOnStockOut: yup.boolean(),
    })
    .required(),
});

const Inventory = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();
  console.log({ errors });

  const { fields, replace } = useFieldArray({
    control,
    name: 'inventories',
  });

  const combinedVariants = useWatch({
    control,
    name: 'combinedVariants',
  });

  useEffect(() => {
    if (combinedVariants && !!combinedVariants.length) {
      const currentFields = combinedVariants.map((variant) => {
        const field = fields.find((field) => field.variant === variant);

        return field
          ? field
          : {
              variant,
              sku: '',
              barcode: '',
            };
      });

      replace(currentFields);
    }
  }, [combinedVariants]);

  return (
    <Grid container rowSpacing={5} columnSpacing={1}>
      <Grid size={12}>
        <TableContainer>
          <Table sx={{ minWidth: 720 }} aria-label="pricing table">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <TableCell sx={{ width: '30%' }}>Variant</TableCell>
                <TableCell sx={{ width: '35%' }}>SKU (Stock keeping unit)</TableCell>
                <TableCell sx={{ width: '35%' }}>Barcode (ISBN, UPC, GTIN etc)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& tr:last-of-type td': { border: 'none' },
              }}
            >
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>{field.variant}</TableCell>
                  <TableCell>
                    <TextField
                      label="SKU  (Stock keeping unit)"
                      type="text"
                      fullWidth
                      error={!!errors.inventories?.[index]?.sku?.message}
                      helperText={errors.inventories?.[index]?.sku?.message}
                      {...register(`inventories.${index}.sku`)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      label="Barcode (ISBN, UPC, GTIN etc)"
                      type="text"
                      error={!!errors.inventories?.[index]?.barcode?.message}
                      helperText={errors.inventories?.[index]?.barcode?.message}
                      {...register(`inventories.${index}.barcode`)}
                      sx={{ px: 0.125 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid size={12}>
        <FormControl component="fieldset" variant="filled" sx={{ display: 'block' }}>
          <FormControlLabel
            control={
              <Controller
                name="invertoryDetails.trackQuantity"
                control={control}
                defaultValue={false}
                render={({ field }) => <Checkbox {...field} checked={field.value} />}
              />
            }
            label="Track quantity"
          />
        </FormControl>

        <FormControl component="fieldset" variant="filled">
          <FormControlLabel
            control={
              <Controller
                name="invertoryDetails.sellOnStockOut"
                control={control}
                defaultValue={false}
                render={({ field }) => <Checkbox {...field} checked={field.value} />}
              />
            }
            label="Continue selling when out of stock"
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Inventory;
