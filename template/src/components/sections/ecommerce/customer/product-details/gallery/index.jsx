import { useRef, useState } from 'react';
import { Box, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import Swiper from 'components/base/Swiper';
import QRPopover from './QRPopover';

const ProductGallery = ({ images }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { up } = useBreakpoints();
  const upLg = up('lg');

  return (
    <Grid
      container
      sx={{
        flex: 1,
        gap: { xs: 2, md: 5, lg: 1 },
        justifyContent: 'center',
        flexWrap: { lg: 'nowrap' },
        height: 1,
        overflow: 'hidden',
      }}
    >
      <Grid
        sx={{
          order: { lg: 1 },
          height: 1,
          maxWidth: { lg: 'fit-content' },
        }}
        size={{
          xs: 12,
          lg: 'grow',
        }}
      >
        <Stack
          sx={{
            gap: 3,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: { lg: 1 },
            width: 1,
            aspectRatio: { lg: 1 },
          }}
        >
          <Button
            ref={navigationPrevRef}
            color="neutral"
            shape="circle"
            variant="soft"
            sx={{
              p: 1,
              minWidth: 0,
              flexShrink: 0,
              position: 'absolute',
              left: 24,
              zIndex: 10,
            }}
          >
            <IconifyIcon
              icon="material-symbols:chevron-left-rounded"
              sx={(theme) => ({
                fontSize: 20,
                transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'none',
              })}
            />
          </Button>
          <Button
            ref={navigationNextRef}
            color="neutral"
            shape="circle"
            variant="soft"
            sx={{ p: 1, minWidth: 0, flexShrink: 0, position: 'absolute', zIndex: 10, right: 24 }}
          >
            <IconifyIcon
              icon="material-symbols:chevron-right-rounded"
              sx={(theme) => ({
                fontSize: 20,
                transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'none',
              })}
            />
          </Button>
          <Swiper
            loop={true}
            spaceBetween={10}
            thumbs={{
              swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[FreeMode, Navigation, Thumbs]}
            navigation={{
              nextEl: navigationNextRef,
              prevEl: navigationPrevRef,
            }}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              height: 1,
              aspectRatio: 1,
              borderRadius: 6,
              maxWidth: { xs: 560, lg: 'unset' },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <Box
                  sx={{
                    height: 1,
                    aspectRatio: 1,
                    flexShrink: 0,
                    borderRadius: 6,
                    overflow: 'hidden',
                    bgcolor: 'background.elevation1',
                    position: 'relative',
                  }}
                >
                  <QRPopover />
                  <Image
                    src={image}
                    alt=""
                    sx={{
                      height: 1,
                      width: 1,
                      objectFit: 'contain',
                      objectPosition: 'top',
                      display: 'block',
                      pointerEvents: 'none',
                    }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Stack>
      </Grid>
      <Grid
        size={{
          xs: 12,
          lg: 'auto',
        }}
      >
        <Swiper
          navigation={false}
          direction={upLg ? 'vertical' : 'horizontal'}
          onInit={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          sx={{
            height: 1,
            flexShrink: 0,
            '& .swiper': {
              height: 1,
              '& .swiper-wrapper': {
                justifyContent: { sm: 'center', lg: 'unset' },
                '.swiper-slide': {
                  width: 'auto',
                  height: 'auto',
                },
              },
            },
          }}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`slide-${index}`}>
              <Box
                sx={{
                  flexShrink: 0,
                  cursor: 'grab',
                  width: { xs: 80, md: 104, xl: 120 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'background.elevation1',
                  border: '2px solid transparent',
                  '.swiper-slide-thumb-active &': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Image
                  src={image}
                  alt=""
                  sx={{ width: 1, objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
};

export default ProductGallery;
