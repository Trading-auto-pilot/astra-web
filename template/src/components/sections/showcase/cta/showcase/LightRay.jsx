import { Box, keyframes } from '@mui/material';

const moveRay = keyframes`
  0% { opacity: 0; transform: translateX(-30%) rotate(-15deg); }
  20% { opacity: 0; }
  40%, 50% { opacity: 1; }
  80% { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(30%) rotate(-15deg); }
`;

const LightRay = ({ bgcolor, animationDuration = 5, animationDelay = 0 }) => (
  <Box
    sx={{
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 1,
      width: '120%',
      left: '-10%',
      opacity: 0,
      animation: `${moveRay} ${animationDuration}s infinite ${animationDelay}s linear`,

      '&::after, &::before': {
        content: '""',
        position: 'absolute',
      },

      '&::after': {
        height: 1246,
        width: 152,
        bottom: 0,
        borderRadius: 54,
        opacity: 0.7,
        background: `linear-gradient(1deg, transparent 0.15%, rgba(255, 255, 255, 0.70) 103.86%)`,
        mixBlendMode: 'plus-lighter',
        filter: 'blur(32px)',
      },

      '&:before': {
        bottom: 216,
        zIndex: 0,
        height: 1286,
        width: 452,
        borderRadius: 54,
        mixBlendMode: 'plus-lighter',
        opacity: 0.6,
        bgcolor: bgcolor,
        filter: 'blur(200px)',
      },
    }}
  />
);

export default LightRay;
