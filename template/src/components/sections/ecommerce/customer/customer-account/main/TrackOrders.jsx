import { useRef, useState } from 'react';
import { Box, Chip, Link, Paper, Stack, Typography } from '@mui/material';
import { toSentenceCase } from 'lib/utils';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'components/base/Image';

const orderTracking = {
  confirmed: {
    color: 'info',
    message:
      'Your order has been confirmed and is now at our main logistics facility, where it will be prepared for shipment.',
  },
  shipped: {
    color: 'warning',
    message:
      'Your package has departed from our central warehouse and is now in transit through our delivery network to your region.',
  },
  out_for_delivery: {
    color: 'warning',
    message:
      'Your package has arrived at our local distribution center and is now on a delivery vehicle heading to your location.',
  },
  delivered: {
    color: 'success',
    message:
      'Your package has been successfully delivered to the specified destination. Thank you for choosing our service.',
  },
};

const TrackOrders = ({ orders }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleDotClick = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <Paper
      component={Stack}
      direction="column"
      sx={{ p: { xs: 3, md: 5 }, height: 1, maxWidth: 1, overflow: 'hidden' }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
        }}
      >
        Track orders
      </Typography>

      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 6,
          bgcolor: 'background.elevation1',
        }}
      >
        <Swiper
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          modules={[Pagination]}
        >
          {orders.map((order) => (
            <SwiperSlide key={order.product.id}>
              <OrderItem order={order} actionUrl="#!" />
            </SwiperSlide>
          ))}
        </Swiper>

        <Stack
          sx={{
            alignItems: 'center',
            gap: 0.5,
            mt: { xs: 3, sm: -1 },
            ml: { xs: 0, sm: 28.75 },
            width: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {orders.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 1,
                backgroundColor: activeIndex === index ? 'primary.main' : 'background.elevation3',
                cursor: 'pointer',
              }}
            />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

const OrderItem = ({ order, actionUrl }) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        columnGap: 3,
      }}
    >
      <Box
        sx={{
          width: 206,
          flexShrink: 0,
          aspectRatio: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image src={order.product.images[0].src} alt="Stain" sx={{ width: 144 }} />
      </Box>
      <Stack
        direction="column"
        sx={{
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Chip
            label={toSentenceCase(order.status)}
            color={orderTracking[order.status].color}
            variant="soft"
            sx={{ mb: 3 }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          >
            {orderTracking[order.status].message}
          </Typography>
          <Link href={actionUrl}>Click here to track your package</Link>
        </div>
      </Stack>
    </Stack>
  );
};

export default TrackOrders;
