import { useState } from 'react';
import { Box, Container, Grid, Stack } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import GradientDivider from '../common/GradientDivider';
import GradientText from '../common/GradientText';
import RevealOnScroll from '../common/RevealOnScroll';
import RevealText from '../common/RevealText';
import SectionModeToggle from '../common/SectionModeToggle';
import LayoutCard from './LayoutCard';

const PrefixedLayouts = ({ data }) => {
  const { up } = useBreakpoints();
  const [isDark, setIsDark] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const upMd = up('md');

  const handleCardActiveChange = (index) => (active) => {
    setActiveCardIndex(active ? index : activeCardIndex === index ? null : activeCardIndex);
  };

  const sectionMode = isDark ? 'dark' : 'light';

  const handleToggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {upMd && (
        <Image
          src={showcaseAssets.prefixedLayout.illustrations[1]}
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            objectFit: 'cover',
            pointerEvents: 'none',
            userSelect: 'none',
            top: 0,
            left: 0,
          }}
        />
      )}

      <Container maxWidth={false} sx={{ maxWidth: { xs: 600, md: 1046 }, p: { xs: 0 } }}>
        <GradientDivider />

        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={({ vars }) => ({
              position: 'relative',
              borderRight: { md: `1px solid ${vars.palette.grey[700]}` },
            })}
          >
            {upMd && (
              <IconifyIcon
                icon="material-symbols:add"
                sx={{
                  position: 'absolute',
                  fontSize: 12,
                  top: -6,
                  right: -6,
                  color: 'common.white',
                }}
              />
            )}
            <Stack
              sx={{
                px: { xs: 3, sm: 5 },
                py: 3,
                columnGap: 1,
                rowGap: 3,
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: 'space-between',
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <RevealText start="top 80%">
                <GradientText variant="h3" gradientOrientation={upMd ? 'ltr' : 'center'}>
                  Or go with a{' '}
                  <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
                    prefixed one
                  </Box>
                </GradientText>
              </RevealText>

              <RevealOnScroll delay={0.4}>
                <SectionModeToggle checked={isDark} onChange={handleToggle} />
              </RevealOnScroll>
            </Stack>

            {data.slice(0, 3).map((layout, index) => (
              <LayoutCard
                key={layout.title}
                index={index}
                data={layout}
                sectionMode={sectionMode}
                isScrollActive={!upMd && activeCardIndex === index}
                onScrollActiveChange={!upMd ? handleCardActiveChange(index) : undefined}
              />
            ))}
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={({ vars }) => ({
              position: 'relative',
              borderLeft: { md: `1px solid ${vars.palette.grey[700]}` },
            })}
          >
            {upMd && (
              <IconifyIcon
                icon="material-symbols:add"
                sx={{
                  position: 'absolute',
                  fontSize: 12,
                  bottom: -6,
                  zIndex: 10,
                  left: -6,
                  color: 'common.white',
                }}
              />
            )}
            {data.slice(-3).map((layout, index) => (
              <LayoutCard
                key={layout.title}
                index={index + 3}
                data={layout}
                sectionMode={sectionMode}
                placement="right"
                isScrollActive={!upMd && activeCardIndex === index + 3}
                onScrollActiveChange={!upMd ? handleCardActiveChange(index + 3) : undefined}
              />
            ))}

            {upMd && <GradientDivider gradientOrientation="ltr" sx={{ pt: 3 }} />}
          </Grid>
        </Grid>

        <GradientDivider sx={{ mb: 0.25 }} />
      </Container>
    </Box>
  );
};

export default PrefixedLayouts;
