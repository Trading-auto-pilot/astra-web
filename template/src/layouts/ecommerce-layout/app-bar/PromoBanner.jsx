import { useEffect, useState } from 'react';
import { Box, Button, ButtonBase, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';

dayjs.extend(duration);
const formatTime = (seconds) => {
  const duration = dayjs.duration(seconds, 'seconds');
  const hours = duration.hours().toString().padStart(2, '0');
  const minutes = duration.minutes().toString().padStart(2, '0');
  const secs = duration.seconds().toString().padStart(2, '0');

  return { hours, minutes, secs };
};

const PromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState(1 * 60 * 60 + 24 * 60 + 48);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, secs } = formatTime(timeLeft);
  const { down } = useBreakpoints();
  const downSm = down('sm');

  return (
    <Stack
      component={downSm ? ButtonBase : Stack}
      gap={2}
      sx={{
        px: { xs: 3, md: 5 },
        minHeight: 46,
        bgcolor: 'warning.lighter',

        alignItems: 'center',
        justifyContent: { md: 'center' },
      }}
    >
      <Box sx={{ flexGrow: { xs: 1, md: 0 }, overflow: 'hidden' }}>
        <Typography
          variant="h6"
          color="warning.darker"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            whiteSpace: 'nowrap',
            '@keyframes marquee': {
              '0%': {
                ml: '100%',
                transform: 'translateX(0%)',
              },
              '100%': {
                ml: 0,
                transform: 'translateX(-100%)',
              },
            },
            animation: { xs: 'marquee 7s linear infinite', md: 'none' },
          }}
        >
          30% Off{' '}
          <Box component="span" fontWeight={500} fontSize="subtitle1.fontSize">
            on all products. Use promo code{' '}
          </Box>
          <Box component="span" fontWeight={700} fontSize="subtitle1.fontSize">
            SAVE30
          </Box>
        </Typography>
      </Box>
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ color: 'warning.dark', ml: { xs: 0, md: 2 }, textAlign: 'center' }}
      >
        <Box
          sx={{
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.warning.mainChannel, 0.08),
            p: 1,
            borderRadius: 2,
            textAlign: 'center',
            minWidth: 40,
          }}
        >
          <Typography variant="body2" color="warning.dark">
            {hours}
          </Typography>
        </Box>
        :
        <Box
          sx={{
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.warning.mainChannel, 0.08),
            p: 1,
            borderRadius: 2,
            minWidth: 40,
          }}
        >
          <Typography variant="body2" color="warning.dark">
            {minutes}
          </Typography>
        </Box>
        :
        <Box
          sx={{
            bgcolor: (theme) => cssVarRgba(theme.vars.palette.warning.mainChannel, 0.08),
            p: 1,
            borderRadius: 2,
            minWidth: 40,
          }}
        >
          <Typography variant="body2" color="warning.dark">
            {secs}
          </Typography>
        </Box>
      </Stack>
      {!downSm && (
        <Button variant="contained" color="warning" sx={{ flexShrink: 0 }}>
          View Deal
        </Button>
      )}
    </Stack>
  );
};

export default PromoBanner;
