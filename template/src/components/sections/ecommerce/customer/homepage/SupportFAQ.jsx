import { Box, Button, Stack, Typography } from '@mui/material';
import illustrationDark from 'assets/images/illustrations/20-dark.webp';
import illustration from 'assets/images/illustrations/20.webp';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const SupportFAQ = () => {
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 7 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Image
          src={{ dark: illustrationDark, light: illustration }}
          alt="supportFAQBot"
          width={336}
          sx={{ objectFit: 'contain' }}
        />
        <Box sx={{ textAlign: { xs: 'center', md: 'start' } }}>
          <Typography
            variant="h4"
            sx={{
              mb: 1,
            }}
          >
            Have questions?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              mb: 5,
              maxWidth: 'sm',
            }}
          >
            Feel no hesitation in knocking us
          </Typography>
          <Button
            variant="soft"
            color="neutral"
            startIcon={
              <IconifyIcon
                icon="material-symbols-light:chat-outline-rounded"
                sx={{ fontSize: '18px !important', mt: '3px' }}
              />
            }
          >
            Chat with our support
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SupportFAQ;
