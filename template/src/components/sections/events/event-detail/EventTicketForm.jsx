import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  formHelperTextClasses,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import NumberTextField from 'components/base/NumberTextField';

export const EventTicketFormSchema = yup.object({
  ticketType: yup.string(),
  firstName: yup.string().required('This field is required'),
  lastName: yup.string().required('This field is required'),
  email: yup.string().required('Email is required').email('Email must be a valid email'),
  emailConfirmation: yup
    .string()
    .oneOf([yup.ref('email'), undefined], 'Emails must match')
    .required('Please confirm your email'),
  phoneNumber: yup.string().required('This field is required'),
  dateOfBirth: yup.string().required('This field is required'),
  quantity: yup
    .number()
    .required('This field is required')
    .min(1, 'Quantity must be greater than 0'),
});

const EventTicketForm = ({ sx }) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid
      container
      columnSpacing={1}
      rowSpacing={2}
      sx={{
        [`& .${formHelperTextClasses.root}`]: {
          mt: 0.5,
        },
        ...sx,
      }}
    >
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <TextField
          fullWidth
          id="firstName"
          type="text"
          label="First name"
          variant="filled"
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          {...register('firstName')}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          sm: 6,
        }}
      >
        <TextField
          fullWidth
          id="lastName"
          type="text"
          label="Last name"
          variant="filled"
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          {...register('lastName')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          id="email"
          type="email"
          label="Email"
          variant="filled"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          id="emailConfirmation"
          type="email"
          label="Re-enter Email"
          variant="filled"
          error={!!errors.emailConfirmation}
          helperText={errors.emailConfirmation?.message}
          {...register('emailConfirmation')}
        />
      </Grid>
      <Grid size={12}>
        <Stack
          sx={{
            gap: 1,
          }}
        >
          <TextField
            disabled
            variant="filled"
            sx={{ maxWidth: 'min-content' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ minWidth: 'unset' }}>
                    <Stack
                      sx={{
                        gap: 1,
                        alignItems: 'center',
                      }}
                    >
                      <IconifyIcon icon="twemoji:flag-bangladesh" sx={{ fontSize: 24 }} />
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Code <br />
                        <Typography variant="body2">+88</Typography>
                      </Typography>
                    </Stack>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            id="phoneNumber"
            type="tel"
            label="Phone number"
            variant="filled"
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
            sx={{ '& input': { direction: 'ltr' } }}
            {...register('phoneNumber')}
          />
        </Stack>
      </Grid>
      <Grid size={12}>
        <FormControl variant="filled" fullWidth={true}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => {
              return (
                <DatePicker
                  label="Date of birth"
                  disableFuture
                  format="DD/MM/YYYY"
                  value={field.value ? dayjs(field.value, 'DD/MM/YYYY') : null}
                  onChange={(newValue) => {
                    const formattedDate = newValue?.format('DD/MM/YYYY');
                    field.onChange(formattedDate || '');
                  }}
                  slotProps={{
                    textField: {
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth?.message,
                    },
                  }}
                />
              );
            }}
          />
        </FormControl>
      </Grid>
      <Grid size={12}>
        <NumberTextField
          helperText={errors.quantity?.message ? errors.quantity?.message : 'Maximum 5 people'}
          fullWidth
          id="quantity"
          type="number"
          label="Quantity"
          variant="filled"
          error={!!errors.quantity}
          {...register(`quantity`, {
            setValueAs: (value) => Number(value),
          })}
        />
      </Grid>
    </Grid>
  );
};

export default EventTicketForm;
