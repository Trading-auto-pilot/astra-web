import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useSettingsContext } from 'providers/SettingsProvider';
import Image from 'components/base/Image';
import { BentoCardHeader } from './BentoCard';

const RealTimeChat = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();

  return (
    <Stack direction="column" height={{ xs: 300 }}>
      <BentoCardHeader
        title="Real time team chat"
        subtitle="Create stunning websites"
        sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, direction: '/* @noflip */ ltr' }}
      />

      <Box sx={{ position: 'absolute', top: 0, left: 0, width: 1, height: { xs: 1, lg: 'auto' } }}>
        <Image
          src={{
            light: `${assetsDir}/images/landing/examples/4.webp`,
            dark: `${assetsDir}/images/landing/examples/4-dark.webp`,
          }}
          sx={{ width: 1, height: 1, objectFit: 'contain' }}
        />
      </Box>
    </Stack>
  );
};

export default RealTimeChat;
