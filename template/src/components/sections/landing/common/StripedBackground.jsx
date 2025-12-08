import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';

export const StripedBackground = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'direction' && prop !== 'stripeColor' && prop !== 'baseColor' && prop !== 'fadeWidth',
})(({ theme, direction = '-45deg', baseColor = 'transparent', fadeWidth = '20%' }) => {
  const {
    config: { textDirection },
  } = useSettingsContext();

  return {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(
        ${textDirection === 'rtl' ? direction.replace('-', '') : direction},
        ${baseColor},
        ${baseColor} 5px,
        ${cssVarRgba(theme.vars.palette.dividerChannel, 0.4)} 5px,
        ${cssVarRgba(theme.vars.palette.dividerChannel, 0.4)} 7px
      )`,
      maskImage: `linear-gradient(
        to right,
        transparent 0,
        black ${fadeWidth},
        black calc(100% - ${fadeWidth}),
        transparent 100%
      )`,
      WebkitMaskImage: `linear-gradient(
        to right,
        transparent 0,
        black ${fadeWidth},
        black calc(100% - ${fadeWidth}),
        transparent 100%
      )`,
      maskSize: '100% 100%',
      WebkitMaskSize: '100% 100%',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
    },
  };
});
