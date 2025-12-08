import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import routePaths from 'docs/routes/docPaths';
import useCountdown from 'hooks/useCountdown';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import CheckMailBoxDialog from '../CheckMailBoxDialog';
import ViewOnlyAlert from '../common/ViewOnlyAlert';

const schema = yup
  .object({
    email: yup.string().email('Email must be a valid email').required('This field is required'),
  })
  .required();

const ForgotPasswordForm = ({ provider = 'jwt', handleSendResetLink }) => {
  const [linkSent, setLinkSent] = useState(false);
  const [openCheckEmailDialog, setOpenCheckEmailDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { time, startTimer } = useCountdown();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await handleSendResetLink({ email: data.email });

      setLinkSent(true);
      setOpenCheckEmailDialog(true);
      if (res?.message) {
        enqueueSnackbar(res.message, { variant: 'success' });
      }
      startTimer(30, () => {
        setLinkSent(false);
      });
    } catch (error) {
      setError('email', { type: 'manual', message: error.message });
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
          maxWidth: '35rem',
          rowGap: 6,
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
          <Typography
            variant="h4"
            sx={{
              mb: 2,
            }}
          >
            Forgot Password?
          </Typography>
          <Typography variant="body1">
            Please enter your email address and an email with a link to reset your password will be
            sent.
          </Typography>
        </Grid>
        <Grid size={12}>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
              <Grid
                sx={{
                  mb: 4,
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
                  mb: 2,
                }}
                size={12}
              >
                <Button
                  type="submit"
                  loading={isSubmitting}
                  fullWidth
                  size="large"
                  variant="contained"
                  disabled={linkSent}
                >
                  Send Reset Link {time > 0 ? ` in ${time} s` : ''}
                </Button>
              </Grid>
              <Grid
                sx={{
                  mb: 6,
                }}
                size={12}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Don&apos;t have access to that email?
                  <Link href="#!" sx={{ ml: 1 }}>
                    Try alternate methods
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Link href="#!" variant="subtitle2">
        Trouble signing in?
      </Link>
      <CheckMailBoxDialog
        open={openCheckEmailDialog}
        handleClose={() => setOpenCheckEmailDialog(false)}
        email={watch('email')}
        time={time}
        handleSendAgain={() => onSubmit({ email: watch('email') })}
      />
    </Stack>
  );
};

export default ForgotPasswordForm;
