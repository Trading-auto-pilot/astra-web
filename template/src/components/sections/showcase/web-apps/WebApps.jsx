import { useCallback, useRef, useState } from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Swiper from 'components/base/Swiper';
import GradientText from '../common/GradientText';
import NeutralButton from '../common/NeutralButton';
import RevealOnScroll from '../common/RevealOnScroll';
import RevealText from '../common/RevealText';
import AppSlide from './AppSlide';

const createGradientOverlay = (direction) => ({
  content: '""',
  position: 'absolute',
  top: 0,
  [direction]: 0,
  width: 1,
  height: 1,
  zIndex: 10,
  pointerEvents: 'none',
  userSelect: 'none',
  background: (theme) =>
    `linear-gradient(to ${direction}, transparent 70%, ${theme.vars.palette.grey[950]})`,
});

const WebApps = ({ data }) => {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { up } = useBreakpoints();

  const upSm = up('sm');

  const slideTo = useCallback((index) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  const onSlideChange = useCallback((swiper) => {
    setActiveIndex(swiper.realIndex);
    swiper.snapGrid = [...swiper.slidesGrid];
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 15,
        '&::after': createGradientOverlay('left'),
        '&::before': createGradientOverlay('right'),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          background: `url(${showcaseAssets.webApps.illustrations[0]}) no-repeat`,
        }}
      />

      <Stack
        alignItems="center"
        direction="column"
        sx={{ px: 3, position: 'relative', zIndex: 3, textAlign: 'center' }}
      >
        <RevealText start="top 80%">
          <GradientText variant="h3" gradientOrientation="center">
            Collection of carefully designed web applications
          </GradientText>
        </RevealText>

        <RevealOnScroll delay={0.4}>
          <Stack direction="row" gap={0.5} mb={3} mt={4}>
            <NeutralButton
              ref={prevRef}
              size="large"
              sx={{ minWidth: 88, py: '11px', borderRadius: 8 }}
            >
              <IconifyIcon icon="material-symbols:arrow-back-rounded" fontSize={20} />
            </NeutralButton>
            <NeutralButton
              ref={nextRef}
              size="large"
              sx={{ minWidth: 88, py: '11px', borderRadius: 8 }}
            >
              <IconifyIcon icon="material-symbols:arrow-forward-rounded" fontSize={20} />
            </NeutralButton>
          </Stack>
        </RevealOnScroll>
      </Stack>

      <Swiper
        slidesPerView={upSm ? 'auto' : 1}
        spaceBetween={32}
        modules={[Navigation, Pagination, FreeMode, Autoplay]}
        autoplay
        loop
        freeMode
        navigation={{ prevEl: prevRef, nextEl: nextRef }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={onSlideChange}
        sx={{
          overflow: 'visible',
          '& .swiper-slide': { width: { xs: 1, sm: 'auto' }, boxSizing: 'border-box' },
          '& .swiper-wrapper': { overflow: 'visible', py: 5 },
        }}
      >
        {data.map((slide, i) => (
          <SwiperSlide key={i}>
            <Stack sx={{ px: { xs: 3, sm: 0 }, width: 1, justifyContent: 'center' }}>
              <AppSlide active={activeIndex === i} index={i} data={slide} />
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>

      <Stack gap={0.5} mt={2} justifyContent="center">
        {data.map((_, i) => (
          <ButtonBase
            key={i}
            onClick={() => slideTo(i)}
            sx={{
              width: i === activeIndex ? 32 : 16,
              height: 5,
              bgcolor: ({ vars }) =>
                cssVarRgba(vars.palette.common.whiteChannel, i === activeIndex ? 1 : 0.4),
              borderRadius: 2.5,
              transition: 'width 0.3s ease-in-out',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default WebApps;
