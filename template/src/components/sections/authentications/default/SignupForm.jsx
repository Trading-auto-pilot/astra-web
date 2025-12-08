import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Divider, Link, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import routePaths from 'docs/routes/docPaths';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';
import PasswordTextField from 'components/common/PasswordTextField';
import ViewOnlyAlert from '../common/ViewOnlyAlert';
import SocialAuth from './SocialAuth';

const schema = yup
  .object({
    name: yup.string().required('This field is required'),
    email: yup
      .string()
      .email('Please provide a valid email address.')
      .required('This field is required'),
    password: yup.string().required('This field is required'),
  })
  .required();

const SignupForm = ({ provider = 'jwt', handleSignup, socialAuth = true, loginLink }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await handleSignup(data).catch((error) => {
      if (error) {
        setError('root.credential', { type: 'manual', message: error.message });
      }
    });
  };

  return (
    <Stack
      direction="column"
      sx={{
        height: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: { md: 10 },
        pb: 10,
      }}
    >
      <div />

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
        {provider === 'firebase' && import.meta.env.VITE_BUILD_MODE === 'production' && (
          <Grid size={12} sx={{ mb: 1 }}>
            <ViewOnlyAlert docLink={`${routePaths.authentication}#firebase`} />
          </Grid>
        )}
        <Grid size={12}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
            }}
          >
            <Typography variant="h4">Sign up</Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
              }}
            >
              Already have an account?
              <Link href={loginLink} sx={{ ml: 1 }}>
                Log in
              </Link>
            </Typography>
          </Stack>
        </Grid>
        {socialAuth && (
          <>
            <Grid size={12}>
              <SocialAuth />
            </Grid>
            <Grid size={12}>
              <Divider sx={{ color: 'text.secondary' }}>or use email</Divider>
            </Grid>
          </>
        )}
        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            {errors.root?.credential?.message && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.root?.credential?.message}
              </Alert>
            )}
            <Grid container>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <TextField
                  fullWidth
                  size="large"
                  id="name"
                  type="text"
                  label="Name"
                  variant="filled"
                  error={!!errors.name}
                  helperText={<>{errors.name?.message}</>}
                  {...register('name')}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 3,
                }}
                size={12}
              >
                <TextField
                  fullWidth
                  size="large"
                  id="email"
                  type="email"
                  label="Email"
                  variant="filled"
                  error={!!errors.email}
                  helperText={<>{errors.email?.message}</>}
                  {...register('email')}
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
                  label="Password"
                  variant="filled"
                  error={!!errors.password}
                  helperText={<>{errors.password?.message}</>}
                  {...register('password')}
                />
              </Grid>
              <Grid
                sx={{
                  mb: 2.5,
                }}
                size={12}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <IconifyIcon
                    icon="material-symbols:info-outline-rounded"
                    fontSize={16}
                    color="warning.main"
                    sx={{ verticalAlign: 'text-bottom' }}
                  />{' '}
                  This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of
                  Service apply. By clicking the Create Account button, you are agreeing to the{' '}
                  <Link href="#!">terms and conditions.</Link>
                </Typography>
              </Grid>
              <Grid size={12}>
                <Button
                  loading={isSubmitting}
                  fullWidth
                  type="submit"
                  size="large"
                  variant="contained"
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Link href="#!" variant="subtitle2" sx={{ flex: 1 }}>
        Trouble signing in?
      </Link>
    </Stack>
  );
};

export default SignupForm;
