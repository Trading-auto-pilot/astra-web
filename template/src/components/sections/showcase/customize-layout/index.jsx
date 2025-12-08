import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Container, Stack, keyframes } from '@mui/material';
import { layoutConfigs } from 'data/showcase';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { blue, green } from 'theme/palette/colors';
import SimpleBar from 'components/base/SimpleBar';
import { RevealOnScroll, RevealText } from '../common';
import GradientText from '../common/GradientText';
import SectionModeToggle from '../common/SectionModeToggle';
import ConfigMenu from './components/ConfigMenu';
import GlowingBg from './components/GlowingBg';
import GridPattern from './components/GridPattern';
import LayoutPreview from './preview';

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(2px, -4px) rotate(0.3deg); }
  50% { transform: translate(-1px, -6px) rotate(0deg); }
  75% { transform: translate(-2px, -4px) rotate(-0.3deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const CustomizeLayout = () => {
  const [isDark, setIsDark] = useState(true);
  const { up } = useBreakpoints();
  const upSm = up('sm');

  const methods = useForm({
    defaultValues: {
      topnavShape: 'default',
      sidenavShape: 'default',
      layout: 'combo',
    },
  });

  const layoutValue = methods.watch('layout');

  return (
    <FormProvider {...methods}>
      <Box sx={{ position: 'relative', mb: { xs: 15, sm: 35 } }}>
        <Container maxWidth={false} sx={{ maxWidth: 966, textAlign: 'center' }}>
          <Stack direction="column" gap={4} alignItems="center" mb={3}>
            <RevealText animateOnScroll={false} delay={1}>
              <GradientText variant="h3" sx={{ textAlign: 'center' }}>
                Customize your own layout
              </GradientText>
            </RevealText>

            <RevealOnScroll animateOnScroll={false} delay={1.2}>
              <SectionModeToggle checked={isDark} onChange={() => setIsDark(!isDark)} />
            </RevealOnScroll>
          </Stack>

          <Box
            sx={{
              width: 1,
              aspectRatio: '16/9',
              position: 'relative',
            }}
          >
            <GridPattern />

            <LayoutPreview isDark={isDark} />

            <GlowingBg bgColor={blue[400]} sx={{ animationDelay: '-6s !important' }} />
            <GlowingBg bgColor={green[400]} />

            {upSm && (
              <Stack
                gap={{ sm: 1, md: 2 }}
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  bottom: 0,
                  width: 'fit-content',
                  left: '50%',
                  justifyContent: 'center',
                  alignItems: 'end',
                  transform: {
                    xs: 'translateY(110%) translateX(-50%)',
                    md: 'translateY(60%) translateX(-50%)',
                  },
                }}
              >
                {layoutConfigs.map((config, i) => (
                  <ConfigMenu
                    key={config.fieldname}
                    data={config}
                    layoutValue={layoutValue}
                    isDark={isDark}
                    sx={{
                      width: config.fieldname === 'layout' ? { xs: 180, md: 240 } : 180,
                      flexShrink: 0,
                      animation: { md: `${float} 8s ease-in-out infinite` },
                      animationDelay: { md: `-${i * 1.5}s` },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {!upSm && (
            <SimpleBar>
              <Stack gap={1} mt={3}>
                {layoutConfigs.map((config) => (
                  <ConfigMenu
                    key={config.fieldname}
                    data={config}
                    isDark={isDark}
                    layoutValue={layoutValue}
                    sx={{ width: 180, flexShrink: 0 }}
                  />
                ))}
              </Stack>
            </SimpleBar>
          )}
        </Container>
      </Box>
    </FormProvider>
  );
};

export default CustomizeLayout;
