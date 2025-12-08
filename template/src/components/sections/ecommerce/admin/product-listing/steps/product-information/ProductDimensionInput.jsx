import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  formHelperTextClasses,
} from '@mui/material';

const ProductDimensionInput = ({ label, field }) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  return (
    <Stack
      sx={{
        gap: 1,
        alignItems: 'center',
      }}
    >
      <TextField disabled label={label} sx={{ width: { xs: 80, sm: 170 } }} />
      <TextField
        label="Value"
        type="number"
        sx={{
          flex: 1,
          [`& .${formHelperTextClasses.root}`]: {
            position: 'absolute',
            bottom: -16,
          },
        }}
        error={!!errors.productInformation?.[field]?.value?.message}
        helperText={errors.productInformation?.[field]?.value?.message}
        {...register(`productInformation.${field}.value`, {
          setValueAs: (value) => Number(value),
        })}
      />
      <FormControl
        variant="filled"
        sx={{ width: { xs: 80, sm: 96 } }}
        error={!!errors.productInformation?.[field]?.unit?.message}
      >
        <InputLabel>Unit</InputLabel>
        <Controller
          name={`productInformation.${field}.unit`}
          control={control}
          defaultValue="ft"
          render={({ field }) => (
            <Select sx={{ height: 1 }} {...field}>
              <MenuItem value="in">Inches</MenuItem>
              <MenuItem value="ft">Feet</MenuItem>
              <MenuItem value="m">Meters</MenuItem>
            </Select>
          )}
        />
        <FormHelperText>{errors.productInformation?.[field]?.unit?.message}</FormHelperText>
      </FormControl>
    </Stack>
  );
};

export default ProductDimensionInput;
