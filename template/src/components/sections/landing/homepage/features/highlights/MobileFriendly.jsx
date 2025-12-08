import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import { BentoCardHeader } from './BentoCard';

const MobileFriendly = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Stack
      direction="column"
      gap={{ xs: 4, md: 4 }}
      sx={{ height: 1, bgcolor: 'primary.lighter', px: { xs: 2, md: 3 } }}
    >
      <BentoCardHeader
        title="Mobile Friendly"
        subtitle="Adapt seamlessly to any device."
        sx={{ pt: { xs: 2, md: 3 } }}
      />

      <Box flex={1} sx={{ alignContent: 'flex-end' }}>
        <Image
          src={{
            light: `${assetsDir}/images/landing/examples/2.webp`,
            dark: `${assetsDir}/images/landing/examples/2-dark.webp`,
          }}
          sx={{ width: 1, height: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </Box>
    </Stack>
  );
};

export default MobileFriendly;
