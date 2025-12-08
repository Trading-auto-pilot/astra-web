import Box from '@mui/material/Box';
import bg from 'assets/images/background/5.webp';
import { cssVarRgba } from 'lib/utils';
import CTA from './CTA';
import NavSection from './NavSection';

const LandingFooter = () => {
  return (
    <Box
      component="footer"
      sx={({ vars }) => ({
        bgcolor: 'background.elevation1',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          background: `url(${bg}) no-repeat, linear-gradient(to bottom, color-mix(in srgb, ${cssVarRgba(vars.palette.background.defaultChannel, 1)} 80%, transparent), ${cssVarRgba(vars.palette.background.defaultChannel, 1)})`,
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        },

        '& > *': {
          position: 'relative',
          zIndex: 1,
        },
      })}
    >
      <CTA />
      <NavSection />
    </Box>
  );
};

export default LandingFooter;
