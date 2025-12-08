import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';

const Timer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const startTimeRef = useRef(null);
  const timerId = useRef(null);

  useEffect(() => {
    if (startTimer) {
      timerId.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          setElapsedTime(Date.now() - startTimeRef.current);
        }
      }, 10);
    } else {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [startTimer]);

  const handleToggleTimer = () => {
    if (startTimer) {
      setStartTimer(false);
    } else {
      setStartTimer(true);
      startTimeRef.current = Date.now() - elapsedTime;
    }
  };

  return (
    <Stack sx={{ gap: 1.75, alignItems: 'center' }}>
      <Button variant="contained" shape="circle" color="primary" onClick={handleToggleTimer}>
        <IconifyIcon
          icon={
            startTimer ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'
          }
          sx={{ fontSize: 24, pointerEvents: 'none' }}
        />
      </Button>
      <Typography variant="subtitle1" sx={{ minWidth: 80 }}>
        {String(Math.floor(elapsedTime / (1000 * 60 * 60))).padStart(1, '0')}:
        {String(Math.floor((elapsedTime / (1000 * 60)) % 60)).padStart(2, '0')}:
        {String(Math.floor((elapsedTime / 1000) % 60)).padStart(2, '0')}
      </Typography>
    </Stack>
  );
};

export default Timer;
