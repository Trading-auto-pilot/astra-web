import { Button, Stack, Typography } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/15-dark.webp';
import illustration from 'assets/images/illustrations/15.webp';
import paths from 'routes/paths';
import Image from 'components/base/Image';

const LandingMaintenance = () => {
  return (
    <Stack
      direction="column"
      sx={{
        px: { xs: 3, md: 5 },
        py: 18,
        gap: 5,
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Image
        src={{
          light: illustration,
          dark: illustrationDark,
        }}
        alt=""
        sx={{ width: 1, maxWidth: 440, objectFit: 'contain' }}
      />

      <div>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Site is temporarily unavailable now.
        </Typography>

        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
          We're working hard to enhance this page!
        </Typography>

        <Button variant="contained" href={paths.landingHomepage}>
          Go Back Home
        </Button>
      </div>
    </Stack>
  );
};

export default LandingMaintenance;
