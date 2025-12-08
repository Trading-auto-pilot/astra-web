import { Box, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import Logo from 'components/common/Logo';
import { RevealOnScroll, RevealText } from '../../common';
import GradientButton from '../../common/GradientButton';
import GradientText from '../../common/GradientText';

const CTAContent = () => {
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <Stack
      direction="column"
      sx={{
        position: 'relative',
        zIndex: 10,
        height: 1,
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack columnGap={2} flexWrap="wrap" alignItems="center" justifyContent="center">
        <Box sx={{ overflow: 'hidden' }}>
          <RevealText>
            <GradientText
              variant={upSm ? 'h1' : 'h3'}
              fontWeight={500}
              gradientOrientation="rtl"
              sx={{ display: 'inline-block' }}
            >
              Begin your journey with
            </GradientText>
          </RevealText>
        </Box>

        <Stack gap={1} alignItems="center">
          <Box sx={{ overflow: 'hidden' }}>
            <RevealOnScroll start="top 75%" delay={0.2}>
              <Stack direction="row" gap={1} alignItems="center" sx={{ display: 'inline-flex' }}>
                <Logo
                  showName={false}
                  sx={{
                    height: upSm ? 62 : 38,
                    width: upSm ? 38 : 22,
                  }}
                />

                <Typography variant={upSm ? 'h1' : 'h3'} fontWeight={500} color="common.white">
                  aurora
                </Typography>
              </Stack>
            </RevealOnScroll>
          </Box>

          <Box sx={{ overflow: 'hidden' }}>
            <RevealText delay={0.2}>
              <GradientText
                variant={upSm ? 'h1' : 'h3'}
                fontWeight={500}
                gradientOrientation="ltr"
                sx={{ display: 'inline-block' }}
              >
                today!
              </GradientText>
            </RevealText>
          </Box>
        </Stack>
      </Stack>

      <RevealOnScroll delay={0.4}>
        <GradientButton href={paths.ecommerce} target="_blank" rel="noopener noreferrer">
          Live Preview
        </GradientButton>
      </RevealOnScroll>
    </Stack>
  );
};

export default CTAContent;
