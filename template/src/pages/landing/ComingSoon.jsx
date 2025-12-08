import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Paper } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/2-dark.webp';
import illustration from 'assets/images/illustrations/2.webp';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import * as yup from 'yup';
import Image from 'components/base/Image';
import StyledTextField from 'components/styled/StyledTextField';

const comingSoonSchema = yup.object({
  email: yup.string().email('Email must be a valid email.').required('Email is required.'),
});

dayjs.extend(duration);

const initialDuration = dayjs.duration({
  days: 360,
  hours: 21,
  minutes: 51,
  seconds: 39,
});

const formatTime = (timeLeft) => {
  if (!timeLeft || timeLeft.asSeconds() <= 0) {
    return { days: 0, hours: '00', minutes: '00', seconds: '00' };
  }

  return {
    days: Math.floor(timeLeft.asDays()),
    hours: String(timeLeft.hours()).padStart(2, '0'),
    minutes: String(timeLeft.minutes()).padStart(2, '0'),
    seconds: String(timeLeft.seconds()).padStart(2, '0'),
  };
};

const TimeBox = ({ time, title }) => {
  return (
    <Paper
      variant="elevation"
      elevation={0}
      background={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: { xs: 80, sm: 104 },
        aspectRatio: '1/1',
      }}
    >
      <Typography variant="h3">{time}</Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {title}
      </Typography>
    </Paper>
  );
};

const LandingComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(comingSoonSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.asSeconds() <= 1) {
          clearInterval(intervalId);

          return dayjs.duration(0);
        }

        return dayjs.duration(prevTime.asSeconds() - 1, 'seconds');
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Stack
      direction="column"
      sx={{
        px: { xs: 3, md: 5 },
        pb: 15,
        pt: 12,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Image
        src={{
          light: illustration,
          dark: illustrationDark,
        }}
        alt="character"
        sx={{ width: 1, maxWidth: 440, objectFit: 'contain', mb: 2 }}
      />

      <Stack
        sx={{
          mb: 6,
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        <TimeBox time={days} title="Days" />
        <TimeBox time={hours} title="Hours" />
        <TimeBox time={minutes} title="Minutes" />
        <TimeBox time={seconds} title="Seconds" />
      </Stack>

      <div>
        <Typography variant="h4" sx={{ mb: 1 }}>
          We are coming soon!
        </Typography>

        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          Stay tuned! Exciting updates are on the way while our team preapares{' '}
          <Box component="span" whiteSpace="nowrap">
            something speacial.
          </Box>
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack sx={{ gap: 1, maxWidth: 400, mx: 'auto', alignItems: 'flex-start' }}>
            <StyledTextField
              variant="filled"
              placeholder="Email"
              type="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ flexGrow: 1 }}
            />
            <Button type="submit" variant="soft" color="neutral">
              Send now
            </Button>
          </Stack>
        </form>
      </div>
    </Stack>
  );
};

export default LandingComingSoon;
