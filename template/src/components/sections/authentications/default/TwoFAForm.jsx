import { Fragment, useEffect, useRef, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import useCountdown from 'hooks/useCountdown';
import StyledTextField from 'components/styled/StyledTextField';

const totalInputLength = 6;

const TwoFAForm = () => {
  const [otp, setOtp] = useState('');
  const inputRefs = useRef([]);
  const [otpSent, setOtpSent] = useState(false);
  const { time, startTimer } = useCountdown();

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value) {
      [...value].slice(0, totalInputLength).forEach((char, charIndex) => {
        if (inputRefs.current && inputRefs.current[index + charIndex]) {
          inputRefs.current[index + charIndex].value = char;
          inputRefs.current[index + charIndex + 1]?.focus();
        }
      });
      const updatedOtp = inputRefs.current.reduce((acc, input) => acc + (input?.value || ''), '');
      setOtp(updatedOtp);
    }
  };

  const handleKeydown = (event, index) => {
    if (event.key === 'Backspace') {
      inputRefs.current[index].value = '';
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();

      const updatedOtp = inputRefs.current.reduce((acc, input) => acc + (input?.value || ''), '');
      setOtp(updatedOtp);
    }
    if (event.key === 'ArrowLeft') {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    }
    if (event.key === 'ArrowRight') {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const sentOtp = () => {
    setOtpSent(true);
    startTimer(30, () => {
      setOtpSent(false);
    });
  };

  useEffect(() => {
    sentOtp();
  }, []);

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
          rowGap: 4,
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
            Enter the OTP
          </Typography>
          <Typography variant="body1">
            A 6-digit one time password (OTP) has been sent to your number{' '}
            <Typography
              component="span"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              +12 ** *** ***89
            </Typography>
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 'medium',
            }}
          >
            Didn&apos;t receive the code?{' '}
            <Link
              variant="caption"
              component="button"
              underline={otpSent ? 'none' : 'always'}
              disabled={otpSent}
              onClick={() => sentOtp()}
              sx={{
                fontWeight: 'medium',
                ml: 0.5,
              }}
            >
              Send again {otpSent && <>in {dayjs(time * 1000).format('m:ss')} s</>}
            </Link>
          </Typography>
        </Grid>
        <Grid size={12}>
          <Box component="form" noValidate>
            <Grid container>
              <Grid
                sx={{
                  mb: 2.5,
                }}
                size={12}
              >
                <Grid
                  container
                  spacing={{ xs: 1, sm: 2 }}
                  sx={{
                    alignItems: 'center',
                  }}
                >
                  {Array(totalInputLength)
                    .fill('')
                    .map((_, index) => (
                      <Fragment key={index}>
                        <Grid>
                          <StyledTextField
                            inputRef={(el) => {
                              inputRefs.current[index] = el;
                            }}
                            type="number"
                            disabledSpinButton
                            sx={{ width: '42px', textAlign: 'center' }}
                            slotProps={{
                              input: {
                                sx: {
                                  '& .MuiInputBase-input': {
                                    textAlign: 'center',
                                    px: '12px !important',
                                  },
                                },
                              },
                            }}
                            onClick={() => inputRefs.current[index]?.select()}
                            onFocus={() => inputRefs.current[index]?.select()}
                            onKeyUp={(e) => handleKeydown(e, index)}
                            onChange={(e) => handleChange(e, index)}
                            size="large"
                          />
                        </Grid>
                        {index === totalInputLength / 2 - 1 && (
                          <Grid sx={{ lineHeight: '32px', marginX: '4px' }}>-</Grid>
                        )}
                      </Fragment>
                    ))}
                </Grid>
              </Grid>
              <Grid
                sx={{
                  mb: 4,
                }}
                size={12}
              >
                <FormControlLabel
                  control={<Checkbox name="checked" size="small" />}
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      Remember this device
                    </Typography>
                  }
                />
              </Grid>
              <Grid
                sx={{
                  mb: 2,
                }}
                size={12}
              >
                <Button
                  fullWidth
                  color="primary"
                  size="large"
                  variant="contained"
                  disabled={otp.length < totalInputLength}
                >
                  Verify
                </Button>
              </Grid>
              <Grid sx={{ textAlign: 'center' }} size={12}>
                <Link href="#!" variant="subtitle2">
                  Try alternate methods
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Link href="#!" variant="subtitle2">
        Trouble signing in?
      </Link>
    </Stack>
  );
};

export default TwoFAForm;
