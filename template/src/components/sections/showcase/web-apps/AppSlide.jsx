import { useEffect, useState } from 'react';
import { Box, Grow, keyframes } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { blue, green, grey } from 'theme/palette/colors';
import GradientButton from '../common/GradientButton';
import GradientText from '../common/GradientText';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const baseGlowStyles = {
  position: 'absolute',
  borderRadius: 6,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  '&::after, &::before': {
    content: '""',
    position: 'absolute',
    width: '250%',
    height: '250%',
    pointerEvents: 'none',
    transform: 'rotate(180deg)',
    animation: `${spin} 8s linear infinite`,
  },
  '&::after': {
    animationDelay: '-4s',
  },
};

const createGlowLayer = (inset, colors) => ({
  ...baseGlowStyles,
  inset,
  ...(inset === -16 && { filter: 'blur(6px)' }),
  '&::before': {
    ...baseGlowStyles['&::after, &::before'],
    backgroundImage: `conic-gradient(transparent 20%, ${colors?.before || '#ffffff'} 35%, transparent 50%)`,
  },
  '&::after': {
    ...baseGlowStyles['&::after, &::before'],
    ...baseGlowStyles['&::after'],
    backgroundImage: `conic-gradient(transparent 20%, ${colors?.after || '#ffffff'} 35%, transparent 50%)`,
  },
});

const AppSlide = ({ data, index, active }) => {
  const { up } = useBreakpoints();
  const isMdUp = up('md');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isMdUp) {
      setIsHovered(active);
    }
  }, [active, isMdUp]);

  const handleMouseEnter = () => isMdUp && setIsHovered(true);
  const handleMouseLeave = () => isMdUp && setIsHovered(false);

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: { xs: 1, sm: 500 },
        maxWidth: { xs: 450, sm: 500 },
        aspectRatio: { xs: '1/1.15', sm: '1/1' },
        position: 'relative',
      }}
    >
      <Grow in={isHovered} timeout={400}>
        <Box sx={createGlowLayer(-16, { before: blue[400], after: green[400] })} />
      </Grow>

      <Grow in={isHovered} timeout={400}>
        <Box sx={createGlowLayer(-6)} />
      </Grow>

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 0 : 1,
          zIndex: 3,
          background: ({ vars }) =>
            `linear-gradient(to top, ${vars.palette.grey[950]}, transparent)`,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
      >
        <Grow in={isHovered} timeout={400}>
          <div>
            <GradientButton href={data.link} target="_blank" rel="noopener noreferrer" mode="light">
              Live Preview
            </GradientButton>
          </div>
        </Grow>
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: 1,
          width: 1,
          borderRadius: 6,
          background: `url(${showcaseAssets.webApps.apps[index]}), ${grey[800]}`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'left top',
          pl: 4,
          pt: { xs: 3, sm: 4 },
          textAlign: 'left',
          overflow: 'hidden',
        }}
      >
        <GradientText variant={isMdUp ? 'h3' : 'h4'} gradientOrientation="ltr" sx={{ mb: 5 }}>
          {data.title}
        </GradientText>
      </Box>
    </Box>
  );
};

export default AppSlide;
