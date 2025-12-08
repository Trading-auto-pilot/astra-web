import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import * as yup from 'yup';
import VariantsList from './VariantsList';

export const productVariantSchema = yup.object({
  variants: yup
    .array()
    .of(
      yup.object({
        items: yup
          .array()
          .of(
            yup.object({
              name: yup.string().optional(),
              value: yup.string().required('Value is required'),
              images: yup.array().of(yup.mixed()).optional(),
            }),
          )
          .required(),
      }),
    )
    .required(),
});

const ProductVariants = () => {
  const { control } = useFormContext();

  const variantsFieldArray = useFieldArray({
    control,
    name: 'variants',
  });
  const { fields: variants, append, replace } = variantsFieldArray;

  const handleVariantsChange = (e) => {
    if (e.target.value === 'hasVariants') {
      append({
        name: '',
        items: [],
      });
    } else {
      replace([]);
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        rowGap: 5,
      }}
    >
      <RadioGroup
        onChange={handleVariantsChange}
        value={variants?.length ? 'hasVariants' : 'noVariants'}
      >
        <FormControlLabel
          value="noVariants"
          control={<Radio />}
          label="This product does not have variants"
        />
        <FormControlLabel
          value="hasVariants"
          control={<Radio />}
          label="This product has variants, like size or color"
        />
      </RadioGroup>

      {!!variants?.length && <VariantsList variantsFieldArray={variantsFieldArray} />}
    </Stack>
  );
};

export default ProductVariants;
