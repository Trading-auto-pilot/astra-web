import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RevealItems from 'components/sections/landing/common/RevealItems';
import RevealText from 'components/sections/landing/common/RevealText';

const CTA = () => {
  return (
    <Stack
      direction="column"
      gap={5}
      sx={{
        alignItems: 'center',
        maxWidth: 600,
        mx: 'auto',
        pt: 15,
        pb: 10,
        px: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <RevealText>
          <Typography
            variant="h2"
            sx={{ typography: { xs: 'h3', sm: 'h2' }, color: 'primary.dark', mb: 1 }}
          >
            Start with us today!
          </Typography>
        </RevealText>

        <RevealText>
          <Typography variant="body2" color="textSecondary">
            Our platform's design and architecture are crafted to boost collaboration, helping your
            team work together more efficiently to achieve their goals.
          </Typography>
        </RevealText>
      </Box>

      <RevealItems component={Stack} gap={1} delay={0.1} y={0}>
        <Button variant="contained">Create an account</Button>
        <Button color="neutral">Sign in</Button>
      </RevealItems>
    </Stack>
  );
};

export default CTA;
