import { Box, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { kebabCase } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

const Features = ({ features }) => {
  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 5 }}>
      <Container sx={{ px: { xs: 0 }, maxWidth: { xl: 1, md: 900 } }}>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 3, xl: 6 }}
          sx={{
            justifyContent: 'center',
          }}
        >
          {features.map((feature) => (
            <Grid
              key={kebabCase(feature.label)}
              size={{
                xs: 6,
                sm: 4,
                xl: 'auto',
              }}
            >
              <Stack
                direction={{ xs: 'column', xl: 'row' }}
                sx={{
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <IconifyIcon
                  sx={{ flexShrink: 0, color: 'success.main', fontSize: 32 }}
                  icon={feature.icon}
                />
                <Typography
                  sx={{
                    typography: { xs: 'subtitle2', sm: 'subtitle1' },
                    fontWeight: { xs: 700, sm: 700 },
                  }}
                >
                  {feature.label}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
