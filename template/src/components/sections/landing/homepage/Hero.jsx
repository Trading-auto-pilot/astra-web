import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import paths from 'routes/paths';
import Image from 'components/base/Image';
import DashedLine from '../common/DashedLine';
import { Dot } from '../common/PageHeader';
import RevealImage from '../common/RevealImage';
import RevealItems from '../common/RevealItems';
import { StripedBackground } from '../common/StripedBackground';

gsap.registerPlugin(SplitText);

const Hero = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const { up } = useBreakpoints();
  const slidesListRef = useRef(null);

  const upLg = up('lg');
  const words = ['productivity', 'efficiency', 'collaboration', 'innovation'];

  useGSAP(() => {
    const container = slidesListRef.current;
    if (!container) return;

    const slides = Array.from(container.children);
    const tl = gsap.timeline({ repeat: -1 });

    const splitTexts = slides.map((slide, i) => {
      const split = new SplitText(slide, { type: 'chars' });
      gsap.set(split.chars, { y: i === 0 ? 0 : 53 });

      return split;
    });

    splitTexts.forEach((split, i) => {
      tl.to(container, { duration: 0.3, y: i * -53 }, i * 2)
        .fromTo(
          split.chars,
          { y: 53 },
          { duration: 0.3, y: 0, stagger: 0.03, ease: 'power2.out' },
          i * 2,
        )
        .to({}, { duration: 1.7 });
    });

    return () => splitTexts.forEach((split) => split.revert());
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: { sm: 7 },
        pt: 10.5,
        pb: { xs: 5, sm: 10.5 },
        px: { xs: 3, md: 5 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1400,
          position: 'relative',
          px: { xs: 0 },
          textAlign: 'center',
          bgcolor: 'background.paper',

          '&::after': {
            content: '""',
            position: 'absolute',
            width: 260,
            height: 96,
            bottom: -96,
            left: -260,
            background: (theme) =>
              `linear-gradient(to bottom left, ${cssVarRgba(theme.vars.palette.background.elevation2Channel, 1)} 0%, transparent 50%)`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 260,
            height: 96,
            top: -96,
            right: -260,
            background: (theme) =>
              `linear-gradient(to top right, ${cssVarRgba(theme.vars.palette.background.elevation2Channel, 1)} 0%, transparent 50%)`,
          },
        }}
      >
        <DashedLine
          orientation="vertical"
          sx={{
            zIndex: 10,
            position: 'absolute',
            left: 0,
            top: -72,
            bottom: -72,
          }}
        />
        <DashedLine
          orientation="vertical"
          sx={{
            zIndex: 10,
            position: 'absolute',
            right: 0,
            top: -72,
            bottom: -72,
          }}
        />
        {upLg && (
          <DashedLine
            orientation="vertical"
            sx={{
              zIndex: 10,
              position: 'absolute',
              left: '50%',
              top: -72,
              bottom: -72,
            }}
          />
        )}
        <DashedLine
          sx={{
            width: '100vw',
            zIndex: 20,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%)',
            top: 0,
          }}
        />
        <DashedLine
          sx={{
            width: 200,
            position: 'absolute',
            left: -200,
            zIndex: 10,
            bottom: 0,
          }}
        />
        <DashedLine
          sx={{
            width: 200,
            position: 'absolute',
            right: -200,
            zIndex: 10,
            bottom: 0,
          }}
        />

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          sx={{
            '&> *': {
              flex: '1 1 50%',
              minWidth: 0,
            },
          }}
        >
          <StripedBackground
            fadeWidth="0"
            sx={() => ({
              p: { xs: 3, sm: 6, md: 10 },
              position: 'relative',
            })}
          >
            <Dot placement="top-left" />
            <Dot placement="top-right" />
            <Dot placement="bottom-right" />
            <Dot placement="bottom-left" />
            <RevealItems
              component={Stack}
              direction="column"
              alignItems="flex-start"
              maxWidth={600}
            >
              <Typography
                variant="h2"
                textAlign={'left'}
                sx={{
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Ultimate web app to{' '}
                <Box component="span" whiteSpace={{ sm: 'nowrap' }}>
                  enhances{' '}
                  <Box
                    component="span"
                    color="primary.main"
                    sx={{
                      position: 'relative',
                      right: 0,
                      display: 'inline-block',
                      overflow: 'hidden',
                      height: 53,
                      verticalAlign: 'top',
                    }}
                  >
                    <Box
                      ref={slidesListRef}
                      sx={{
                        position: 'relative',
                        display: 'block',
                      }}
                    >
                      {words.map((word) => (
                        <Box
                          key={word}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 53,
                            flexDirection: ({ direction }) =>
                              direction === 'rtl' ? 'row-reverse' : 'row',
                            justifyContent: ({ direction }) =>
                              direction === 'rtl' ? 'flex-end' : 'flex-start',
                            lineHeight: 1.5,
                          }}
                        >
                          {word}.
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Typography>

              <Typography
                variant="h5"
                color="textSecondary"
                textAlign="left"
                fontWeight={500}
                mb={4}
              >
                Try our app for a simpler, organized workflow.
              </Typography>

              <Typography variant="body2" color="textSecondary" textAlign="left" mb={5}>
                Our web app offers a seamless experience, allowing you to manage projects
                effortlessly while collaborating with your team in real-time.
              </Typography>

              <Stack gap={1}>
                <Button variant="contained">Start today</Button>
                <Button variant="soft" color="neutral" href={paths.landingContact}>
                  Contact us
                </Button>
              </Stack>
            </RevealItems>
            <DashedLine
              gradientOrientation="none"
              sx={{
                width: 1,
                position: 'absolute',
                zIndex: 10,
                bottom: 0,
                left: 0,
              }}
            />
          </StripedBackground>
          <Box
            sx={{
              position: 'relative',
              width: 1,
              backgroundImage: ({ vars }) =>
                `linear-gradient(to bottom, transparent, ${vars.palette.common.background})`,
            }}
          >
            <Dot placement="top-right" />
            <Dot placement="bottom-right" />
            <Dot placement="bottom-left" />
            <RevealImage>
              <Image
                src={{
                  light: `${assetsDir}/images/landing/hero/1.webp`,
                  dark: `${assetsDir}/images/landing/hero/1-dark.webp`,
                }}
                sx={{
                  position: { lg: 'absolute' },
                  top: 0,
                  left: 0,
                  width: 1,
                  objectFit: 'cover',
                  objectPosition: 'top',
                  maxHeight: 700,
                  maskImage: {
                    xs: `linear-gradient(to bottom, black 75%, transparent)`,
                    lg: `linear-gradient(to bottom, black 30%, transparent 80%)`,
                  },
                }}
              />
            </RevealImage>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
