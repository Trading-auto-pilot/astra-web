import { useRef } from 'react';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { kebabCase } from 'lib/utils';
import paths from 'routes/paths';
import { Autoplay, Navigation } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import Swiper from 'components/base/Swiper';

const MostViewedProducts = ({ products }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <Box sx={{ px: { xs: 3, md: 5 }, py: 5 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        Best viewed items this week
      </Typography>
      <Stack
        sx={{
          gap: 3,
          alignItems: 'center',
          width: 1,
        }}
      >
        <Button
          ref={navigationPrevRef}
          color="neutral"
          variant="soft"
          sx={{ p: 1, minWidth: 0, flexShrink: 0 }}
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
          variant="soft"
          sx={{ p: 1, minWidth: 0, flexShrink: 0, order: 1 }}
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
          slidesPerView="auto"
          loop={true}
          autoplay={true}
          spaceBetween={8}
          navigation={{
            prevEl: navigationPrevRef,
            nextEl: navigationNextRef,
          }}
          modules={[Navigation, Autoplay]}
          sx={{
            flex: 1,
            overflow: 'hidden',
            '& .swiper-slide': {
              width: 'auto',
              boxSizing: 'border-box',
            },
          }}
        >
          {products.map(({ id, name, images }) => (
            <SwiperSlide key={id}>
              <Link
                href={paths.productDetails(String(id))}
                underline="none"
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: 'background.elevation1',
                  borderRadius: 6,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'background.elevation2',
                  },
                }}
              >
                <Image
                  src={images[0].src}
                  alt={kebabCase(name)}
                  width={160}
                  sx={{ objectFit: 'contain', pointerEvents: 'none' }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </Box>
  );
};

export default MostViewedProducts;
