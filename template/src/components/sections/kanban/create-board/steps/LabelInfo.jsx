import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import ColorPicker from 'components/base/color-picker/ColorPicker';

export const labelInfoFormSchema = yup.object().shape({
  labels: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().required('Label name is required'),
        color: yup.string().required('Color is required'),
      }),
    )
    .required(),
});

const LabelInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'labels',
  });

  return (
    <>
      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 3, position: 'relative' }}
        >
          <Controller
            control={control}
            name={`labels.${index}.label`}
            render={({ field: controllerField }) => {
              return (
                <TextField
                  fullWidth
                  label={`Label ${index + 1}`}
                  error={!!errors.labels?.[index]?.label}
                  helperText={errors.labels?.[index]?.label?.message}
                  {...controllerField}
                />
              );
            }}
          />
          <Controller
            control={control}
            name={`labels.${index}.color`}
            render={({ field: controllerField }) => (
              <ColorPicker
                id={`label-color-picker-${index}`}
                value={controllerField.value}
                onChange={(color) => controllerField.onChange(color)}
              />
            )}
          />

          <IconButton color="error" disabled={!(fields.length > 1)} onClick={() => remove(index)}>
            <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
          </IconButton>
        </Stack>
      ))}

      <Button
        variant="text"
        color="primary"
        startIcon={
          <IconifyIcon icon="material-symbols:add-circle-rounded" sx={{ height: 20, width: 20 }} />
        }
        onClick={() => append({ label: '', color: 'primary.lighter' })}
      >
        Add Label
      </Button>
    </>
  );
};

export default LabelInfo;
