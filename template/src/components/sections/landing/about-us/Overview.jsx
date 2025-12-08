import { Avatar, Box, Button, Container, Grid, Typography } from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import DashedLine from '../common/DashedLine';
import RevealItems from '../common/RevealItems';
import RevealText from '../common/RevealText';
import SectionHeader from '../common/SectionHeader';
import { StripedBackground } from '../common/StripedBackground';

const createGradientBg = (direction) => ({
  content: '""',
  position: 'absolute',
  top: direction === 'left' ? '50%' : '-50%',
  [direction]: '-35%',
  width: '65%',
  height: '80%',
  background: (theme) => cssVarRgba(theme.vars.palette.success.mainChannel, 0.4),
  pointerEvents: 'none',
  userSelect: 'none',
  borderRadius: '100%',
  filter: 'blur(164px)',
});

const stats = [
  {
    id: 1,
    label: 'Design',
    content: '105+ Project Delivered',
    color: 'primary',
    icon: 'material-symbols:format-shapes-outline-rounded',
  },
  {
    id: 2,
    label: 'Development',
    content: '200+ Applications Built',
    color: 'info',
    icon: 'material-symbols:code-rounded',
  },
  {
    id: 3,
    label: 'Growth Marketing',
    content: '300%',
    color: 'success',
    icon: 'material-symbols:show-chart-rounded',
  },
];

const Overview = () => {
  const { currentBreakpoint } = useBreakpoints();
  const isSm = currentBreakpoint === 'sm';

  return (
    <StripedBackground>
      <Box
        sx={[
          {
            overflow: 'hidden',
            width: 1,
            height: 1,
            position: 'relative',
            py: 8,
          },
        ]}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: 1000,
            '&::before': createGradientBg('left'),
            '&::after': createGradientBg('right'),
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              px: { xs: 3, md: 6, lg: 10 },
              py: { xs: 7 },
              bgcolor: 'background.paper',
              borderRadius: 4,
              textAlign: 'center',
              zIndex: 20,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <SectionHeader title="About aurora" subtitle="What is Aurora" sx={{ mb: 1 }} />

              <RevealText delay={0.2}>
                <Typography variant="subtitle2" fontWeight={400} sx={{ maxWidth: 600, mx: 'auto' }}>
                  Aurora, an intuitive admin dashboard designed for seamless management, is
                  celebrated for its user-friendly interface, powerful analytics, and a community
                  that fosters collaboration and growth.
                </Typography>
              </RevealText>
            </Box>

            <RevealItems
              component={Grid}
              container
              spacing={1}
              sx={{ mb: { xs: 4, sm: 0, md: 4 } }}
            >
              {stats.map((stat) => (
                <Grid key={stat.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 2,
                      p: 3,
                      bgcolor: `${stat.color}.lighter`,
                      overflow: 'hidden',
                      textAlign: 'left',

                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.6,
                        backgroundImage: ({ vars }) =>
                          `linear-gradient(${vars.palette.divider} 1px, transparent 1px),
         linear-gradient(to right, ${vars.palette.divider} 1px, transparent 1px)`,
                        backgroundSize: '28px 28px',
                        pointerEvents: 'none',
                        WebkitMaskImage:
                          'linear-gradient(to right, transparent, black 100%), linear-gradient(to top, transparent, black 100%)',
                        WebkitMaskComposite: 'destination-in',
                        maskComposite: 'intersect',
                      },
                    }}
                  >
                    <Box
                      sx={(theme) => ({
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: theme.palette[stat.color].main,
                        opacity: 0.3,
                        fontSize: 48,
                        lineHeight: 1,
                      })}
                    >
                      <IconifyIcon icon={stat.icon} />
                    </Box>

                    <Avatar
                      sx={{
                        borderRadius: 1,
                        height: 32,
                        width: 32,
                        mb: 2,
                        bgcolor: `${stat.color}.main`,
                      }}
                    >
                      <IconifyIcon icon={stat.icon} fontSize={20} />
                    </Avatar>

                    <Typography variant="subtitle2" fontWeight={600} color="textSecondary" mb={1}>
                      {stat.label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {stat.content}
                    </Typography>
                  </Box>
                </Grid>
              ))}

              {isSm && (
                <Grid size={6} sx={{ alignSelf: 'center' }}>
                  <Button variant="soft" color="neutral" size="medium">
                    Our Works
                  </Button>
                </Grid>
              )}
            </RevealItems>

            {!isSm && (
              <Button variant="soft" color="neutral" size="medium">
                Our Works
              </Button>
            )}
          </Box>
        </Container>

        <DashedLine
          gradientOrientation="none"
          sx={{ position: 'absolute', zIndex: 20, width: 1, height: '1px', left: 0, top: 0 }}
        />
        <DashedLine
          gradientOrientation="none"
          sx={{ position: 'absolute', zIndex: 20, width: 1, height: '1px', left: 0, bottom: 0 }}
        />
      </Box>
    </StripedBackground>
  );
};

export default Overview;
