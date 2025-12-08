import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import routePaths from 'docs/routes/docPaths';
import ViewOnlyAlert from 'components/sections/authentications/common/ViewOnlyAlert';

const Auth0Login = () => {
  const { loginWithRedirect } = useAuth0();

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const handleLoginRedirect = async () => {
    setLoginLoading(true);
    await loginWithRedirect();
    setLoginLoading(false);
  };

  const handleSignupRedirect = async () => {
    setSignupLoading(true);
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
    setSignupLoading(false);
  };

  return (
    <Stack
      direction="column"
      sx={[
        {
          height: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: { md: 10 },
          pb: 10,
        },
        (loginLoading || signupLoading) && {
          pointerEvents: 'none',
        },
      ]}
    >
      <div />

      <Box
        sx={{
          p: 5,
        }}
      >
        <Box
          sx={{
            mb: 6,
          }}
        >
          {import.meta.env.VITE_BUILD_MODE === 'production' && (
            <ViewOnlyAlert docLink={`${routePaths.authentication}#auth0`} sx={{ mb: 6 }} />
          )}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
            }}
          >
            Log in
          </Typography>
          <Typography variant="body1">
            Click redirect button to continue logging in with Auth0
          </Typography>
        </Box>

        <Box>
          <Grid container spacing={2.5}>
            <Grid
              size={{
                xs: 12,
                lg: 6,
              }}
            >
              <Button
                fullWidth
                size="large"
                variant="soft"
                loading={signupLoading}
                onClick={handleSignupRedirect}
                sx={{ textWrap: 'nowrap' }}
              >
                Redirect to Auth0 Sign Up
              </Button>
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 6,
              }}
            >
              <Button
                fullWidth
                size="large"
                variant="contained"
                loading={loginLoading}
                onClick={handleLoginRedirect}
                sx={{ textWrap: 'nowrap' }}
              >
                Redirect to Auth0 Log In
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Link href="#!" variant="subtitle2">
        Trouble signing in?
      </Link>
    </Stack>
  );
};

export default Auth0Login;
