import { useRef } from 'react';
import { Box, Button, Stack, useTheme } from '@mui/material';
import { Navigation } from 'swiper/modules';
import { Swiper as ReactSwiper } from 'swiper/react';
import IconifyIcon from './IconifyIcon';

const Swiper = ({ ref, children, sx, navigation = false, navigationPosition, ...rest }) => {
  const theme = useTheme();

  const defaultPrevRef = useRef(null);
  const defaultNextRef = useRef(null);

  const isCustomNavigation = typeof navigation === 'object';
  const prevRef = isCustomNavigation ? navigation.prevEl : defaultPrevRef;
  const nextRef = isCustomNavigation ? navigation.nextEl : defaultNextRef;

  return (
    <Box key={theme.direction} sx={{ position: 'relative', ...sx }} dir={theme.direction} ref={ref}>
      {navigation && !isCustomNavigation && (
        <Stack
          sx={{
            justifyContent: 'space-between',
            width: 1,
            px: { xs: 1, sm: 2, md: 5 },
            position: 'absolute',
            zIndex: 2,
            top: '50%',
            transform: 'translateY(-50%)',
            ...navigationPosition,
          }}
        >
          <Button ref={prevRef} color="neutral" variant="soft" sx={{ p: 1, minWidth: 0 }}>
            <IconifyIcon flipOnRTL icon="material-symbols:chevron-left-rounded" fontSize={20} />
          </Button>
          <Button ref={nextRef} color="neutral" variant="soft" sx={{ p: 1, minWidth: 0 }}>
            <IconifyIcon flipOnRTL icon="material-symbols:chevron-right-rounded" fontSize={20} />
          </Button>
        </Stack>
      )}
      <ReactSwiper
        modules={[Navigation]}
        navigation={
          navigation
            ? {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            : undefined
        }
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation) {
            const navigationOptions = swiper.params.navigation;
            navigationOptions.prevEl = prevRef.current;
            navigationOptions.nextEl = nextRef.current;
          }
        }}
        {...rest}
      >
        {children}
      </ReactSwiper>
    </Box>
  );
};

Swiper.displayName = 'Swiper';

export default Swiper;
