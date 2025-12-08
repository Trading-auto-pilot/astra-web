import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import paths from 'routes/paths';
import * as yup from 'yup';
import PasswordTextField from 'components/common/PasswordTextField';

const schema = yup
  .object({
    email: yup.string().email('Invalid email format').required('This field is required'),
    token: yup.string().required('This field is required'),
    password: yup
      .string()
      .required('This field is required')
      .min(8, 'Password must be at least 8 characters long'),
    password_confirmation: yup
      .string()
      .required('Confirm password field is required.')
      .oneOf([yup.ref('password')], 'Your passwords do not match.'),
  })
  .required();

const SetPasswordForm = ({ handleSetPassword }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const token = useMemo(() => searchParams.get('token'), [searchParams]);
  const email = useMemo(() => searchParams.get('email'), [searchParams]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: email || '', token: token || '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await handleSetPassword(data);
      enqueueSnackbar(res.message, { variant: 'success' });
      navigate(paths.defaultJwtLogin);
    } catch (error) {
      setError('root', { type: 'manual', message: error.message });
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        flex: 1,
        height: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: { md: 10 },
        pb: 10,
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' } }} />
      <Grid
        container
        sx={{
          height: 1,
          maxWidth: '35rem',
          rowGap: 4,
          alignContent: { md: 'center' },
          p: { xs: 3, sm: 5 },
          mb: 5,
        }}
      >
        <Grid size={12}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
            }}
          >
            Set new password
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 1,
            }}
          >
            Create a new password for your account. New password must be different from any previous
            passwords.
            <Link href="#!" sx={{ ml: 1 }}>
              See password policy
            </Link>
          </Typography>
        </Grid>

        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {errors.root && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.root.message}
              </Alert>
            )}

            <Grid container>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <PasswordTextField
                  fullWidth
                  size="large"
                  id="password"
                  label="Password"
                  variant="filled"
                  error={!!errors.password}
                  helperText={<>{errors.password?.message}</>}
                  {...register('password')}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 4,
                }}
                size={12}
              >
                <PasswordTextField
                  fullWidth
                  size="large"
                  id="password"
                  label="Confirm Password"
                  variant="filled"
                  error={!!errors.password_confirmation}
                  helperText={<>{errors.password_confirmation?.message}</>}
                  {...register('password_confirmation')}
                />
              </Grid>

              <Grid size={12}>
                <Button
                  loading={isSubmitting}
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Set New Password
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Link href="#!" variant="subtitle2">
        Contact Support
      </Link>
    </Stack>
  );
};

export default SetPasswordForm;
