import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import bg from 'assets/images/background/4.webp';
import IconifyIcon from 'components/base/IconifyIcon';
import RevealItems from '../../../common/RevealItems';
import SectionHeader from '../../../common/SectionHeader';

const FeaturesOverview = ({ data }) => {
  return (
    <Box
      sx={{
        pt: { xs: 4, sm: 8 },
        pb: 5,
        px: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          background: `url(${bg}) no-repeat`,
          backgroundPosition: 'center 24%',
          transform: (theme) => (theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'),
          zIndex: -1,
        }}
      />
      <Container maxWidth={false} sx={{ maxWidth: 1080, px: { xs: 0 } }}>
        <Stack direction="column" gap={3}>
          <SectionHeader title="Features" subtitle="Packed with essential abilities" />

          <RevealItems component={Grid} container columns={12}>
            {data.map((feature, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6 }}>
                <FeatureItem title={feature.title} description={feature.description} />
              </Grid>
            ))}
          </RevealItems>
        </Stack>
      </Container>
    </Box>
  );
};

export default FeaturesOverview;

const FeatureItem = ({ title, description }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Stack gap={2}>
        <IconifyIcon
          icon="material-symbols:network-node"
          sx={{ fontSize: 24, color: 'primary.main', flexShrink: 0 }}
        />
        <Stack direction="column" gap={1} pt={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
