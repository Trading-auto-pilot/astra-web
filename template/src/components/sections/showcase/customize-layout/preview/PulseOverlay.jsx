import { useFormContext } from 'react-hook-form';
import { Box, keyframes } from '@mui/material';
import { cssVarRgba } from 'lib/utils';

const bgPulse = keyframes`50% { background-color: rgba(51, 133, 240, .3); }`;

const PulseOverlay = ({ layoutConfig }) => {
  const { watch } = useFormContext();
  const config = watch();

  if (!layoutConfig) return null;

  const baseStyles = {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    pointerEvents: 'none',
    bgcolor: ({ vars }) => cssVarRgba(vars.palette.common.whiteChannel, 0.05),
    animation: `${bgPulse} 2s ease-in-out infinite`,
  };

  const configKey = `${config.layout}-${config.sidenavShape}-${config.topnavShape}`;

  const isCombo = config.layout === 'combo';

  if (isCombo) {
    const topnavEntry = Object.entries(layoutConfig).find(([key]) => key.includes('topnav'));
    const topnavHeight = topnavEntry?.[1]?.height || '0%';

    return (
      <>
        {Object.entries(layoutConfig).map(([key, size], index) => {
          const isSidenav = key.includes('sidenav');

          return (
            <Box
              key={`${configKey}-${key}-${index}`}
              sx={{
                ...baseStyles,
                top: isSidenav ? topnavHeight : 0,
                width: size.width,
                height: isSidenav ? `calc(100% - ${topnavHeight})` : size.height,
              }}
            />
          );
        })}
      </>
    );
  }

  return (
    <Box
      key={configKey}
      sx={{
        ...baseStyles,
        top: 0,
        width: layoutConfig.width,
        height: layoutConfig.height,
      }}
    />
  );
};

export default PulseOverlay;
