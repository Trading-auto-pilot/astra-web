import { useRef } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Swiper from 'components/base/Swiper';
import ProductCard from './ProductCard';

const SuggestedProducts = ({ title = 'Products that might helpful for you', products }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const { up } = useBreakpoints();
  const upMd = up('md');

  return (
    <>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: { xs: 3, md: 2 },
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {upMd && (
          <Stack
            sx={{
              alignItems: 'center',
              gap: 1,
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
              sx={{ p: 1, minWidth: 0, flexShrink: 0 }}
            >
              <IconifyIcon
                icon="material-symbols:chevron-right-rounded"
                sx={(theme) => ({
                  fontSize: 20,
                  transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'none',
                })}
              />
            </Button>
          </Stack>
        )}
      </Stack>
      {upMd ? (
        <Swiper
          slidesPerView="auto"
          loop={true}
          spaceBetween={8}
          navigation={{
            prevEl: navigationPrevRef,
            nextEl: navigationNextRef,
          }}
          sx={{
            '& .swiper-slide': {
              width: { md: 'auto' },
              height: 'auto',
              boxSizing: 'border-box',
            },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} sx={{ width: { md: 360 }, borderRadius: 2 }} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Grid container>
          {products.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <ProductCard product={product} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default SuggestedProducts;
