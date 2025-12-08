import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import illustrationDark from 'assets/images/illustrations/12-dark.webp';
import illustration from 'assets/images/illustrations/12.webp';
import Image from 'components/base/Image';

const NoFilesFound = () => {
  return (
    <Stack direction="column" sx={{ height: 1, justifyContent: 'center' }}>
      <Stack
        direction="column"
        gap={5}
        sx={{ justifyContent: 'center', alignItems: 'center', py: 10 }}
      >
        <Stack
          direction="column"
          sx={{ maxWidth: 380, justifyContent: 'center', alignItems: 'center', mb: 3 }}
        >
          <Image
            src={{ light: illustration, dark: illustrationDark }}
            sx={{ width: 1, height: 1, objectFit: 'contain' }}
          />
        </Stack>

        <Stack direction="column" gap={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Your file space is currently empty!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', letterSpacing: 0, maxWidth: 395, textAlign: 'center' }}
          >
            Start by clicking the ‘Upload’ button to begin adding your files and managing your
            space.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default NoFilesFound;
