import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { cssVarRgba } from 'lib/utils';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import { BentoCardHeader } from './BentoCard';

const APIS = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Box
      sx={{
        height: { xs: 300 },
        overflow: 'hidden',
        position: 'relative',

        '&:before': {
          content: '""',
          position: 'absolute',
          inset: 0,

          backgroundImage: ({ vars }) =>
            `radial-gradient(${cssVarRgba(vars.palette.background.elevation2Channel, 1)} 30%, transparent 30%),
     radial-gradient(${cssVarRgba(vars.palette.background.elevation2Channel, 1)} 30%, transparent 30%)`,
          backgroundPosition: '0px 0px, 4px 4px',
          backgroundSize: '8px 8px',

          WebkitMaskImage:
            'linear-gradient(to bottom left, rgba(0,0,0,0) 20%, rgba(0,0,0,0.4) 50%,rgba(0,0,0,1) 80%)',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskImage:
            'linear-gradient(to bottom left, rgba(0,0,0,0) 20%, rgba(0,0,0,0.4) 50%,rgba(0,0,0,1) 80%)',
          maskRepeat: 'no-repeat',
          maskSize: '100% 100%',
        },
      }}
    >
      <Stack
        direction="column"
        gap={{ xs: 2, md: 4 }}
        sx={{
          justifyContent: 'space-between',
          position: 'relative',
          height: 1,
          overflow: 'hidden',
        }}
      >
        <BentoCardHeader
          title="Powerful APIS"
          subtitle="Create stunning websites"
          sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}
        />

        <Box
          sx={{
            width: 1,
            position: 'relative',
            left: { xs: 16, md: 24 },
            height: 1,
            borderRadius: 4,
            overflow: 'hidden',
            maxHeight: 204,
            boxShadow: 2,
            borderEndStartRadius: 0,
          }}
        >
          <Image
            src={{
              light: `${assetsDir}/images/landing/examples/5.webp`,
              dark: `${assetsDir}/images/landing/examples/5-dark.webp`,
            }}
            sx={{ width: 1, display: 'block' }}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default APIS;
