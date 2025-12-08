import { Button, Container, Link, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import RevealItems from '../common/RevealItems';
import RevealText from '../common/RevealText';
import { StripedBackground } from '../common/StripedBackground';

const Newsletter = () => {
  return (
    <StripedBackground
      fadeWidth="0"
      sx={{
        px: { xs: 4, sm: 10 },
        py: { xs: 5, sm: 11 },
        bgcolor: 'background.elevation1',
        zIndex: 1,

        '&::before': {
          maskImage: `linear-gradient(
            to right,
            transparent 0%,
            black 30%,
            transparent 60%
          )`,
        },
      }}
    >
      <Container maxWidth={false} sx={{ position: 'relative', maxWidth: 1048, px: { xs: 0 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          gap={{ xs: 4, md: 0 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="column" gap={1} sx={{ height: 1 }}>
            <RevealText>
              <Typography variant="h4">Want to stay updated?</Typography>
            </RevealText>
            <RevealText>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Subscribe to our newsletter
              </Typography>
            </RevealText>
          </Stack>
          <RevealItems component={Stack} direction="column" gap={2} sx={{ height: 1 }}>
            <Stack component="form" onSubmit={(e) => e.preventDefault()} gap={1}>
              <StyledTextField placeholder="Email" fullWidth sx={{ maxWidth: 291 }} />
              <Button type="submit" variant="contained">
                Subscribe
              </Button>
            </Stack>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, color: 'text.secondary', px: '10.5px' }}
            >
              your privacy is safe with us. Read our <Link href="#!">terms and conditions</Link>
            </Typography>
          </RevealItems>
        </Stack>
      </Container>
    </StripedBackground>
  );
};

export default Newsletter;
