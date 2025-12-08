import { useEffect } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import * as yup from 'yup';
import StyledTextField from 'components/styled/StyledTextField';

export const productPricingSchema = yup.object({
  variantPricing: yup
    .array()
    .of(
      yup.object({
        variant: yup.string().required(),
        quantity: yup.number().positive('Value must be a positive number').required(),
        regularPrice: yup.number().positive('Value must be a positive number').required(),
        salePrice: yup.number().positive('Value must be a positive number').required(),
        includeTax: yup.boolean().required(),
        tax: yup.number().when('includeTax', {
          is: true,
          then: (schema) => schema.positive('Value must be a positive number'),
        }),
      }),
    )
    .required(),
});

const PricingQuantity = () => {
  const { control } = useFormContext();
  const { fields, replace } = useFieldArray({
    control,
    name: 'variantPricing',
  });

  const combinedVariants = useWatch({
    control,
    name: 'combinedVariants',
  });

  useEffect(() => {
    if (combinedVariants && combinedVariants.length) {
      const updatedFields = combinedVariants.map((variant) => {
        const existingField = fields.find((f) => f.variant === variant);

        return (
          existingField ?? {
            variant,
            quantity: 0,
            regularPrice: 0,
            salePrice: 0,
            includeTax: false,
            tax: 0,
          }
        );
      });

      const hasChanged =
        updatedFields.length !== fields.length ||
        updatedFields.some((field, index) => field.variant !== fields[index]?.variant);

      if (hasChanged) {
        replace(updatedFields);
      }
    }
  }, [combinedVariants, fields, replace]);

  return (
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
            <TableCell>Variant</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Regular pricing</TableCell>
            <TableCell>Sale price</TableCell>
            <TableCell>Include tax</TableCell>
            <TableCell>Tax (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            '& tr:last-of-type td': { border: 'none' },
          }}
        >
          {fields.map((field, index) => (
            <TableRowForm key={field.id} index={index} field={fields[index]} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TableRowForm = ({ index, field }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const includeTax = useWatch({
    control,
    name: `variantPricing.${index}.includeTax`,
  });

  return (
    <TableRow>
      <TableCell sx={{ minWidth: 202 }}>{field.variant}</TableCell>
      <TableCell sx={{ minWidth: 80 }}>
        <StyledTextField
          variant="filled"
          type="number"
          error={!!errors.variantPricing?.[index]?.quantity}
          {...register(`variantPricing.${index}.quantity`)}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 120 }}>
        <StyledTextField
          variant="filled"
          type="number"
          error={!!errors.variantPricing?.[index]?.regularPrice}
          {...register(`variantPricing.${index}.regularPrice`, {
            setValueAs: (value) => Number(value),
          })}
        />
      </TableCell>
      <TableCell sx={{ minWidth: 120 }}>
        <StyledTextField
          variant="filled"
          type="number"
          error={!!errors.variantPricing?.[index]?.salePrice}
          {...register(`variantPricing.${index}.salePrice`, {
            setValueAs: (value) => Number(value),
          })}
        />
      </TableCell>
      <TableCell align="right">
        <Switch color="primary" {...register(`variantPricing.${index}.includeTax`)} />
      </TableCell>
      <TableCell sx={{ minWidth: 120 }}>
        <StyledTextField
          variant="filled"
          type="number"
          disabled={!includeTax}
          error={!!errors.variantPricing?.[index]?.tax}
          {...register(`variantPricing.${index}.tax`, {
            setValueAs: (value) => Number(value),
          })}
        />
      </TableCell>
    </TableRow>
  );
};

export default PricingQuantity;
