import { useMemo } from 'react';
import { Box, Button, Chip, Container, Typography, keyframes } from '@mui/material';
import { useThemeMode } from 'hooks/useThemeMode';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import DashedLine from '../common/DashedLine';

const Hero = () => {
  const {
    config: { assetsDir },
  } = useSettingsContext();
  const { isDark } = useThemeMode();
  const { up } = useBreakpoints();
  const upSm = up('sm');

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: 12, px: { xs: 3, md: 5 } }}>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1400,
          position: 'relative',
          px: { xs: 0 },
          pt: 13,
          textAlign: 'center',
          bgcolor: 'background.paper',

          '&::after': {
            content: '""',
            position: 'absolute',
            width: 260,
            height: 96,
            bottom: -1,
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
            height: '105%',
            zIndex: 10,
            position: 'absolute',
            left: 0,
            bottom: 0,
          }}
        />
        <DashedLine
          orientation="vertical"
          sx={{
            height: '105%',
            position: 'absolute',
            right: 0,
            bottom: 0,
          }}
        />
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
            width: '100vw',
            position: 'absolute',
            left: '50%',
            zIndex: -10,
            transform: 'translate(-50%)',
            bottom: 96,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 10, mb: 5.5 }}>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '-40%',
              width: 412,
              height: 330,
              bgcolor: 'transparent',
              overflow: 'hidden',
              opacity: isDark ? 0.8 : 0.5,
              backgroundImage: ({ vars }) =>
                `linear-gradient(${vars.palette.divider} 1px, transparent 1px),
       linear-gradient(to right, ${vars.palette.divider} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              pointerEvents: 'none',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)',
              maskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          />

          <Box sx={{ position: 'relative', px: 2 }}>
            <Typography
              variant="h2"
              sx={{ typography: { xs: 'h3', sm: 'h2' }, maxWidth: 800, mx: 'auto', mb: 3 }}
            >
              Get to Know Us: Together, We Create{' '}
              <Box component="span" color="primary.main">
                Magic!
              </Box>{' '}
              🌟🤗
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ maxWidth: 730, mx: 'auto', mb: 5 }}
            >
              Creating products with a strong identity. We provide brilliant ideas and adding the
              world called success brand. We deliver customized marketing campaign to use your
              audience to make a positive move.
            </Typography>
            <Button variant="contained" href={paths.landingContact}>
              Let's talk now
            </Button>
          </Box>
        </Box>

        <Box
          sx={(theme) => ({
            position: 'relative',
            zIndex: 10,
            maxWidth: 600,
            mx: 'auto',
            width: 1,
            aspectRatio: '60 / 53',
            bgcolor: 'background.elevation1',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            isolation: 'isolate',

            '&::before': {
              content: '""',
              position: 'absolute',
              width: '140%',
              height: '120%',
              left: '50%',
              bottom: 0,
              transform: 'translateX(-50%)',
              background: cssVarRgba(theme.vars.palette.success.mainChannel, 0.15),
              borderRadius: '100%',
              filter: 'blur(164px)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 0,
            },

            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${isDark ? `${assetsDir}/images/landing/hero/1-dark.webp` : `${assetsDir}/images/landing/hero/1.webp`})`,
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 1,
            },
          })}
        >
          {upSm && (
            <>
              <CursorElement
                color="info"
                label="Easy Installation"
                sx={{
                  top: '40%',
                }}
              />
              <CursorElement
                direction="left"
                color="primary"
                label="Modern Design"
                sx={{
                  top: '10%',
                }}
              />
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const drift = keyframes`
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(var(--tx1), var(--ty1)); }
  40%  { transform: translate(var(--tx2), var(--ty2)); }
  60%  { transform: translate(var(--tx3), var(--ty3)); }
  80%  { transform: translate(var(--tx4), var(--ty4)); }
  100% { transform: translate(0, 0); }
`;

const CursorElement = ({ direction = 'right', color, label, sx }) => {
  const isLeft = direction === 'left';

  const cssVars = useMemo(() => {
    const r = (min, max) => Math.round(min + Math.random() * (max - min));
    const px = (n) => `${n}px`;

    const biasRangeX = isLeft ? [-65, 15] : [-15, 65];
    const biasRangeY = [-35, 35];

    return {
      ['--tx1']: px(r(...biasRangeX)),
      ['--ty1']: px(r(...biasRangeY)),
      ['--tx2']: px(r(...biasRangeX)),
      ['--ty2']: px(r(...biasRangeY)),
      ['--tx3']: px(r(...biasRangeX)),
      ['--ty3']: px(r(...biasRangeY)),
      ['--tx4']: px(r(...biasRangeX)),
      ['--ty4']: px(r(...biasRangeY)),
      ['--dur']: `${Math.round(10 + Math.random() * (15 - 10))}s`,
      ['--delay']: `${Math.round(-4 + Math.random() * 4)}s`,
    };
  }, [isLeft]);

  return (
    <Box
      sx={{
        zIndex: 30,
        width: 'fit-content',
        [isLeft ? 'right' : 'left']: { sm: '-10%', md: '-30%' },
        position: 'absolute',
        animation: `${drift} var(--dur) cubic-bezier(0.22, 1, 0.36, 1) infinite`,
        animationDelay: 'var(--delay)',
        willChange: 'transform',
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          transform: 'none',
        },
        ...sx,
      }}
      style={cssVars}
    >
      <Chip variant="filled" size="large" label={label} sx={{ bgcolor: `${color}.main` }} />

      <Box
        sx={{
          position: 'absolute',
          top: -14,
          [direction]: -12,
          color: `${color}.main`,
          transform: (theme) =>
            (theme.direction === 'rtl') !== isLeft ? 'rotate(-90deg)' : 'none',
          filter: isLeft
            ? 'drop-shadow( 1px 2px 3px rgba(0,0,0,0.22)) drop-shadow(10px 16px 18px rgba(0,0,0,0.08))'
            : 'drop-shadow(-1px 2px 3px rgba(0,0,0,0.22)) drop-shadow(-10px 16px 18px rgba(0,0,0,0.08))',
        }}
      >
        <IconifyIcon icon="material-symbols:near-me-rounded" fontSize={24} />
      </Box>
    </Box>
  );
};

export default Hero;
