import { useRef } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { SwiperSlide } from 'swiper/react';
import IconifyIcon from 'components/base/IconifyIcon';
import Swiper from 'components/base/Swiper';
import BoardItem from './BoardItem';

const BoardsSlider = ({ boardList, size = 'medium' }) => {
  const { title, boards } = boardList;
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const swiperRef = useRef(null);

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 5 }}>
      <Stack sx={{ justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {title}
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
      </Stack>
      <Swiper
        slidesPerView="auto"
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
        {boards.map((board) => (
          <SwiperSlide key={board.id}>
            <BoardItem board={board} size={size} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Paper>
  );
};

export default BoardsSlider;
