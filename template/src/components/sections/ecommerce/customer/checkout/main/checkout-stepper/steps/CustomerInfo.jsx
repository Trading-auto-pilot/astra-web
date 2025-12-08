import { useFormContext } from 'react-hook-form';
import { InputAdornment, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';

export const customerInfoFormSchema = yup
  .object({
    customer: yup.object({
      email: yup.string().email().required('This field is required'),
      firstName: yup.string().required('This field is required'),
      lastName: yup.string().required('This field is required'),
      phoneNumber: yup.string().required('This field is required'),
    }),
  })
  .required();

const CustomerInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid
      container
      columnSpacing={2}
      sx={{
        rowGap: 3,
        my: 3,
      }}
    >
      <Grid size={12}>
        <TextField
          fullWidth
          id="email"
          type="email"
          label="Email address*"
          variant="filled"
          error={!!errors.customer?.email}
          helperText={errors.customer?.email?.message}
          {...register('customer.email')}
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
          id="firstName"
          type="text"
          label="First name*"
          variant="filled"
          error={!!errors.customer?.firstName}
          helperText={errors.customer?.firstName?.message}
          {...register('customer.firstName')}
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
          label="Last name*"
          variant="filled"
          error={!!errors.customer?.lastName}
          helperText={errors.customer?.lastName?.message}
          {...register('customer.lastName')}
        />
      </Grid>
      <Grid size={12}>
        <Stack
          sx={{
            gap: 2,
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
                      <Typography variant="body2" color="text.secondary">
                        +88
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
            label="Phone number*"
            variant="filled"
            error={!!errors.customer?.phoneNumber}
            helperText={errors.customer?.phoneNumber?.message}
            sx={{ '& input': { direction: 'ltr' } }}
            {...register('customer.phoneNumber')}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CustomerInfo;
