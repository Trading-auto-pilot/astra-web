import { Button, Stack, Typography } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/10-dark.webp';
import illustration from 'assets/images/illustrations/10.webp';
import Image from 'components/base/Image';

const StorageCTA = () => {
  return (
    <Stack direction="column" gap={2} alignItems="center">
      <Image
        src={{ dark: illustrationDark, light: illustration }}
        sx={{ objectFit: 'contain', width: 128, height: 128 }}
      />

      <Typography variant="subtitle2" sx={{ fontWeight: 500, textAlign: 'center' }}>
        Want to Increase Storage Capacity?
      </Typography>

      <Button variant="contained" color="primary" fullWidth>
        Upgrade
      </Button>
    </Stack>
  );
};

export default StorageCTA;
