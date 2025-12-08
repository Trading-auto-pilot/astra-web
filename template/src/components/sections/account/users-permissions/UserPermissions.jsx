import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormControlLabel, Switch } from '@mui/material';

const UserPermissions = () => {
  const { watch, control } = useFormContext();
  const userPermissions = watch('userPermissions');

  return (
    <FormControl component="fieldset" sx={{ mb: 5, gap: 2 }}>
      {userPermissions.map((permission, index) => (
        <Controller
          key={permission.name}
          control={control}
          name={`userPermissions.${index}.checked`}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch size="small" checked={field.value} {...field} />}
              label={permission.label}
              sx={{ gap: 2, ml: 0 }}
            />
          )}
        />
      ))}
    </FormControl>
  );
};

export default UserPermissions;
