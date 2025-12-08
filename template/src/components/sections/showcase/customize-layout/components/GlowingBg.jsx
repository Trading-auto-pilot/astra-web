import { Box, keyframes } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';

const cornerToCorner = (size) => keyframes`
  0% { 
    left: 0; 
    top: 0; 
  }
  25% { 
    left: calc(100% - ${size}px); 
    top: 0; 
  }
  50% { 
    left: calc(100% - ${size}px); 
    top: calc(100% - ${size}px); 
  }
  75% { 
    left: 0; 
    top: calc(100% - ${size}px); 
  }
  100% { 
    left: 0; 
    top: 0; 
  }
`;

const GlowingBg = ({ bgColor, sx }) => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const size = upSm ? 350 : 250;

  return (
    <Box
      sx={{
        ...sx,
        position: 'absolute',
        width: size,
        height: size,
        animation: `${cornerToCorner(size)} 12s linear infinite`,
        transition: 'left 0.45s ease, top 0.45s ease, right 0.45s ease, bottom 0.45s ease',

        '&::after, &::before': {
          content: '""',
          position: 'absolute',
          bgcolor: bgColor,
        },

        '&::after': {
          inset: 66,
          mixBlendMode: 'plus-lighter',
          filter: 'blur(54px)',
        },

        '&::before': {
          inset: 0,
          filter: 'blur(146px)',
        },
      }}
    />
  );
};

export default GlowingBg;
