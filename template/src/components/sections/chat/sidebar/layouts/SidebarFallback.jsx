import { Stack, Typography } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/9-dark.webp';
import illustration from 'assets/images/illustrations/9.webp';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';

const SidebarFallback = () => {
  const { only } = useBreakpoints();

  const onlySm = only('sm');

  if (onlySm) return;

  return (
    <Stack
      direction="column"
      justifyContent="center"
      height={1}
      alignItems="center"
      flex={1}
      gap={5}
    >
      <Typography variant="subtitle2" color="text.secondary">
        No chats here yet
      </Typography>

      <Image
        src={{ dark: illustrationDark, light: illustration }}
        alt=""
        sx={{
          maxWidth: 258,
          width: 1,
        }}
      />
    </Stack>
  );
};

export default SidebarFallback;
