import { Box, Stack } from '@mui/material';
import splash from 'assets/json/splash-loader.json';
import Lottie from 'lottie-react';

const Splash = (props) => {
  return (
    <Stack
      {...props}
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Box
        sx={{
          height: 50,
          width: 50,
        }}
      >
        <Lottie animationData={splash} />
      </Box>
    </Stack>
  );
};

export default Splash;
