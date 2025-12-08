import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CTAContent from './CTAContent';
import LightRay from './LightRay';

const ShowcaseCTA = () => {
  const [rayProps, setRayProps] = useState([
    { duration: 2, delay: 0 },
    { duration: 4, delay: 2 },
    { duration: 3, delay: 4 },
  ]);

  useEffect(() => {
    setRayProps([
      { duration: 6 + Math.random() * 2, delay: 0 },
      { duration: 6 + Math.random() * 2, delay: 2 + Math.random() },
      { duration: 6 + Math.random() * 2, delay: 4 + Math.random() },
    ]);
  }, []);

  return (
    <Box sx={{ position: 'relative', height: 660, px: { xs: 1, sm: 3 }, overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          height: 1,
          width: 1,
          maxWidth: 966,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {rayProps.map((props, i) => (
          <LightRay
            key={i}
            bgcolor={(theme) =>
              [
                theme.vars.palette.chGreen[400],
                theme.vars.palette.chBlue[400],
                theme.vars.palette.secondary.main,
              ][i]
            }
            animationDuration={props.duration}
            animationDelay={props.delay}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            width: 1,
            height: 1,
            top: 0,
            left: 0,
            backgroundImage: ({ vars }) =>
              `linear-gradient(180deg, transparent 54.92%, ${vars.palette.grey[950]} 91.21%)`,
          },
          '&::after': {
            transform: 'scaleY(-1)',
          },
        }}
      />

      <CTAContent />
    </Box>
  );
};

export default ShowcaseCTA;
