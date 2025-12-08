import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import Editor from 'components/base/Editor';

export const nameDescriptionFormSchema = yup
  .object({
    name: yup.string().required('This field is required'),
    description: yup.string().required('This field is required'),
  })
  .required();

const NameDescription = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth
          id="name"
          type="text"
          label="Name of product"
          variant="filled"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name')}
        />
      </Grid>
      <Grid size={12}>
        <FormControl variant="filled" fullWidth error={!!errors.description}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Editor
                onChange={field.onChange}
                content={field.value}
                isValid={!errors.description}
              />
            )}
          />
          <FormHelperText>{errors.description?.message}</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default NameDescription;
