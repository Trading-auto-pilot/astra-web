import { useEffect, useRef, useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Image from 'components/base/Image';
import GradientDivider from '../common/GradientDivider';

gsap.registerPlugin(ScrollTrigger);

const LayoutCard = ({
  data,
  index,
  placement = 'left',
  sectionMode = 'dark',
  isScrollActive = false,
  onScrollActiveChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { up } = useBreakpoints();
  const cardRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  const upMd = up('md');
  const isLeft = placement === 'left';
  const isActive = upMd ? isHovered : isScrollActive || isHovered;

  useEffect(() => {
    if (!upMd && cardRef.current && onScrollActiveChange) {
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: cardRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => onScrollActiveChange(true),
        onLeave: () => onScrollActiveChange(false),
        onEnterBack: () => onScrollActiveChange(true),
        onLeaveBack: () => onScrollActiveChange(false),
      });
    }

    return () => scrollTriggerRef.current?.kill();
  }, [upMd, onScrollActiveChange]);

  const glowProps = {
    position: 'absolute',
    top: 0,
    height: 1,
    pointerEvents: 'none',
    userSelect: 'none',
    opacity: isActive ? 1 : 0,
    transition: 'opacity 0.3s',
  };

  return (
    <Box sx={{ display: 'block' }} ref={cardRef}>
      <GradientDivider
        gradientOrientation={upMd ? (isLeft ? 'rtl' : 'ltr') : 'center'}
        sx={{ zIndex: 10 }}
      />

      <Stack
        sx={{
          pl: { xs: 5, md: isLeft ? 5 : 0 },
          pr: { xs: 5, md: isLeft ? 0 : 5 },
          flexDirection: { md: isLeft ? 'row' : 'row-reverse' },
        }}
      >
        <GradientDivider
          orientation="vertical"
          gradientOrientation="none"
          sx={{
            opacity: isActive ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        />

        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{ flex: 1, position: 'relative' }}
        >
          <Link
            href={`${data.link}&themeMode=${sectionMode}`}
            underline="none"
            rel="noopener"
            target="_blank"
            sx={{ position: 'absolute', inset: 0, zIndex: 15 }}
          />

          {(!upMd || isLeft) && (
            <Box sx={{ ...glowProps, left: 0, transform: 'translateX(-100%)' }}>
              <Image src={showcaseAssets.prefixedLayout.illustrations[0]} sx={{ height: 1 }} />
            </Box>
          )}

          <Box
            sx={{
              position: 'relative',
              zIndex: 5,
              overflow: 'hidden',
              width: 1,
              aspectRatio: '16/9',
              backgroundImage: `url(${sectionMode === 'dark' ? showcaseAssets.prefixedLayout.dark : showcaseAssets.prefixedLayout.light})`,
              backgroundSize: '600% auto',
              backgroundPosition: `${(index * 100) / 5}% top`,
            }}
          ></Box>

          {(!upMd || !isLeft) && (
            <Box
              sx={{
                ...glowProps,
                right: 0,
                transform: 'translateX(100%) scaleX(-1)',
              }}
            >
              <Image src={showcaseAssets.prefixedLayout.illustrations[0]} sx={{ height: 1 }} />
            </Box>
          )}
        </Box>

        {!upMd && (
          <GradientDivider
            orientation="vertical"
            gradientOrientation="none"
            sx={{
              opacity: isActive ? 0 : 1,
              transition: 'opacity 0.3s',
            }}
          />
        )}
      </Stack>

      <GradientDivider gradientOrientation={upMd ? (isLeft ? 'rtl' : 'ltr') : 'center'} />

      <Box
        sx={(theme) => ({
          p: isLeft ? theme.spacing(2, 5, 4, 5) : theme.spacing(2, 3, 4, 3),
          textAlign: { xs: 'center', md: 'left' },
        })}
      >
        <Typography variant="subtitle2" fontWeight={600} color="common.white">
          {data.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default LayoutCard;
