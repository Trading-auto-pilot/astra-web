import { Stack } from '@mui/material';
import { useSwiper } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import { CustomNavButton } from './CustomNavButton';

export const SwiperNavigation = () => {
  const swiper = useSwiper();

  return (
    <Stack gap={1} sx={{ position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
      <CustomNavButton onClick={() => swiper.slidePrev()}>
        <IconifyIcon flipOnRTL icon="material-symbols:keyboard-arrow-left" fontSize={24} />
      </CustomNavButton>

      <CustomNavButton onClick={() => swiper.slideNext()}>
        <IconifyIcon flipOnRTL icon="material-symbols:keyboard-arrow-right" fontSize={24} />
      </CustomNavButton>
    </Stack>
  );
};
