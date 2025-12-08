import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';

const LoginAlerts = () => {
  const { control } = useFormContext();

  return (
    <FormControl component="form" sx={{ gap: 1, mb: 5 }}>
      <Controller
        name="email_alert"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox checked={field.value} size="small" {...field} />}
            label="Send an email to so*******@email.com"
          />
        )}
      />
      <Controller
        name="text_message_alert"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox checked={field.value} size="small" {...field} />}
            label="Send a text message to 24**********"
          />
        )}
      />
    </FormControl>
  );
};

export default LoginAlerts;
