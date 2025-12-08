import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormControlLabel, Switch } from '@mui/material';

const Global = () => {
  const { control, watch } = useFormContext();

  const globalPermissions = watch('globalPermissions');

  return (
    <FormControl component="fieldset" sx={{ gap: 2 }}>
      {globalPermissions.map((permission, index) => (
        <Controller
          key={permission.name}
          control={control}
          name={`globalPermissions.${index}.checked`}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch size="small" checked={field.value} {...field} />}
              label={permission.label}
              sx={{ gap: 2, ml: 0, alignItems: 'flex-start' }}
            />
          )}
        />
      ))}
    </FormControl>
  );
};

export default Global;
