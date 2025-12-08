import Box from '@mui/material/Box';
import bgGradient from 'assets/images/background/1.webp';
import { useThemeMode } from 'hooks/useThemeMode';
import { cssVarRgba } from 'lib/utils';

export const CardWrapper = ({ children, sx }) => {
  const { mode } = useThemeMode();

  return (
    <Box
      sx={(theme) => ({
        background:
          mode === 'light'
            ? `
           url(${bgGradient}) no-repeat center 100% / cover,
           linear-gradient(
             0deg,
             ${cssVarRgba(theme.vars.palette.chGreen['950Channel'], 0.02)},
             ${cssVarRgba(theme.vars.palette.chGreen['950Channel'], 0.02)}
           ),
           linear-gradient(
             242.63deg,
             ${cssVarRgba(theme.vars.palette.background.elevation1Channel, 1)} 45.75%,
             ${cssVarRgba(theme.vars.palette.chGreen['50Channel'], 1)} 94.14%,
             ${cssVarRgba(theme.vars.palette.chGreen['100Channel'], 1)} 140.25%
           )`
            : `
           url(${bgGradient}) no-repeat center 65% / cover,
           linear-gradient(
             0deg,
             ${cssVarRgba(theme.vars.palette.chGreen['950Channel'], 0.02)},
             ${cssVarRgba(theme.vars.palette.chGreen['950Channel'], 0.02)}
           ),
           linear-gradient(
             242.63deg,
             ${cssVarRgba(theme.vars.palette.background.elevation1Channel, 1)} 45.75%,
             ${cssVarRgba(theme.vars.palette.chGreen['50Channel'], 1)} 94.14%,
             ${cssVarRgba(theme.vars.palette.chGreen['100Channel'], 1)} 140.25%
           )`,
        borderRadius: theme.spacing(3),
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: { xs: 3, lg: 5 },

        '& .swiper-pagination': {
          top: theme.spacing(1.5),
          left: 0,
          width: 'auto',
          display: 'flex',
          right: 'auto',
          bottom: 'auto',
        },
        '& .swiper-pagination-bullet': {
          backgroundColor: `${theme.vars.palette.chGreen['100']} !important`,
          borderRadius: `${theme.spacing(1.5)} !important`,
          width: theme.spacing(2),
          height: theme.spacing(0.5),
          margin: theme.spacing(0, 0.5),
          transition: 'all 0.3s ease',
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: `${theme.vars.palette.chGreen['400']} !important`,
          opacity: 1,
          width: `${theme.spacing(4)} !important`,
        },
        '& .swiper-button-disabled': {
          opacity: '1 !important',
          pointerEvents: 'auto',
        },
        ...sx,
      })}
    >
      {children}
    </Box>
  );
};
