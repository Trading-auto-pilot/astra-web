import { useRef } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Swiper from 'components/base/Swiper';
import EventCard from 'components/sections/events/event-detail/main/EventCard';

const EventShowcase = ({ showcase }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const swiperRef = useRef(null);

  return (
    <>
      <Stack
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 3,
        }}
      >
        <Typography variant="h6" sx={{ lineHeight: 1.5 }}>
          More events from this organizer
        </Typography>
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
            shape="circle"
            sx={{
              p: 1,
              minWidth: 0,
              flexShrink: 0,
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
            variant="soft"
            shape="circle"
            sx={{
              p: 1,
              minWidth: 0,
              flexShrink: 0,
            }}
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
      </Stack>

      <Swiper
        slidesPerView="auto"
        loop={false}
        spaceBetween={16}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        navigation={{
          prevEl: navigationPrevRef,
          nextEl: navigationNextRef,
        }}
        sx={{
          '& .swiper-slide': {
            width: 'auto',
            height: 'auto',
            boxSizing: 'border-box',
          },
        }}
      >
        {showcase.map((event) => (
          <SwiperSlide key={event.id}>
            <EventCard event={event} sx={{ width: { xs: 270, md: 300 }, borderRadius: 6 }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default EventShowcase;
