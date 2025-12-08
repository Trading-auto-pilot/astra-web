import { Box, Paper, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import rocketDark from 'assets/images/illustrations/17-dark.webp';
import rocket from 'assets/images/illustrations/17.webp';
import customerDark from 'assets/images/illustrations/18-dark.webp';
import customer from 'assets/images/illustrations/18.webp';
import aiToolsDark from 'assets/images/illustrations/19-dark.webp';
import aiTools from 'assets/images/illustrations/19.webp';
import { promoSliderData } from 'data/e-commerce/dashboard';
import { useThemeMode } from 'hooks/useThemeMode';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SwiperSlide } from 'swiper/react';
import Image from 'components/base/Image';
import Swiper from 'components/base/Swiper';
import { CardWrapper } from './CardWrapper';
import { SwiperNavigation } from './SwiperNavigation';

const PromoSlider = () => {
  const { isDark } = useThemeMode();

  const imageMap = {
    rocket: { light: rocket, dark: rocketDark },
    customer: { light: customer, dark: customerDark },
    aiTools: { light: aiTools, dark: aiToolsDark },
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        height: 1,
      }}
    >
      <CardWrapper>
        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            pauseOnMouseEnter: true,
          }}
          loop={true}
          sx={{
            width: 1,
            height: 1,
            '& .swiper': { height: 1 },
            '& .swiper-wrapper': { height: 1 },
          }}
        >
          <SwiperNavigation />
          {promoSliderData.map((slide) => {
            const imageSrc = isDark
              ? imageMap[slide.imageKey].dark
              : imageMap[slide.imageKey].light;

            return (
              <SwiperSlide
                key={slide.title}
                style={{
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    height: 1,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    sx={{ height: 1, gridColumn: { xs: '1/-1', sm: '1/3' } }}
                  >
                    <div></div>
                    <Stack
                      direction="column"
                      sx={{
                        gap: 2,
                        width: 1,
                        pt: 6,
                        pb: 5,
                        maxWidth: { xs: 'none', lg: 280 },
                      }}
                    >
                      <Typography
                        variant="h5"
                        lineHeight={1.2}
                        sx={{ typography: { xs: 'h4', md: 'h5', lg: 'h4' }, color: 'success.dark' }}
                      >
                        {slide.title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'success.main',
                          maxWidth: 320,
                        }}
                      >
                        {slide.subtitle}
                      </Typography>
                    </Stack>

                    <Button
                      href={slide.buttonLink}
                      variant="contained"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {slide.buttonText}
                    </Button>
                  </Stack>

                  <Stack
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gridColumn: '3/4',
                      pt: 5,
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    <Image
                      src={imageSrc}
                      alt={slide.imageKey}
                      sx={{
                        alignSelf: 'center',
                        objectFit: 'contain',
                        width: 1,
                        maxHeight: 180,
                      }}
                    />
                  </Stack>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </CardWrapper>
    </Paper>
  );
};

export default PromoSlider;
