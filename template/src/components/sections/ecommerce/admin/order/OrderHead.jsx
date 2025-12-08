import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { orderDetailsList } from 'data/e-commerce/orders';
import dayjs from 'dayjs';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import { useOrderDetails } from './OrderDetailsProvider';

const OrderHead = ({ breadcrumb }) => {
  const { order, setSetselectedOrder } = useOrderDetails();
  const [canGoToNext, setCanGoToNext] = useState(true);
  const [canGoToPrev, setCanGoToPrev] = useState(false);
  const { down } = useBreakpoints();
  const downLg = down('lg');

  const handleNextOrder = () => {
    const currentIndex = orderDetailsList.findIndex((o) => o.id === order?.id);
    if (canGoToNext) {
      setSetselectedOrder(orderDetailsList[currentIndex + 1]);
      setCanGoToPrev(true);
    }
    if (currentIndex + 1 === orderDetailsList.length - 1) {
      setCanGoToNext(false);
    }
  };
  const handlePreviousOrder = () => {
    const currentIndex = orderDetailsList.findIndex((o) => o.id === order?.id);
    if (canGoToPrev) {
      setSetselectedOrder(orderDetailsList[currentIndex - 1]);
      setCanGoToNext(true);
    }
    if (currentIndex - 1 === 0) {
      setCanGoToPrev(false);
    }
  };

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: 'fit-content' }}>
          <PageBreadcrumb items={breadcrumb} sx={{ mb: 1, flexWrap: 'nowrap' }} />

          <Typography
            variant="h4"
            sx={[
              {
                mb: 2,
              },
              downLg && { fontSize: 'h5.fontSize' },
            ]}
          >
            Order <Box component="span">{order?.id}</Box>
          </Typography>

          <Stack
            sx={{
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button
              variant="soft"
              color="neutral"
              shape="circle"
              disabled={!canGoToPrev}
              onClick={handlePreviousOrder}
            >
              <IconifyIcon
                flipOnRTL
                icon="material-symbols:arrow-back-rounded"
                sx={{ fontSize: 20, color: 'neutral.dark' }}
              />
            </Button>

            <Button
              variant="soft"
              color="neutral"
              shape="circle"
              disabled={!canGoToNext}
              onClick={handleNextOrder}
            >
              <IconifyIcon
                flipOnRTL
                icon="material-symbols:arrow-forward-rounded"
                sx={{ fontSize: 20, color: 'neutral.dark' }}
              />
            </Button>
          </Stack>
        </Box>

        <Stack
          direction="column"
          sx={{
            flex: 1,
            alignItems: { sm: 'flex-end' },
          }}
        >
          <Stack sx={{ gap: 1, mb: 3 }}>
            <Button
              variant="soft"
              color="neutral"
              sx={{ flexShrink: 0, flexGrow: { xs: 1, sm: 'unset' } }}
            >
              Edit order
            </Button>
            <Button
              variant="soft"
              color="neutral"
              sx={{ flexShrink: 0, flexGrow: { xs: 1, sm: 'unset' } }}
            >
              Print order
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: { sm: 'end' },
              mt: 'auto',
            }}
          >
            <Box component="span" whiteSpace="nowrap">
              Placed on <strong>{dayjs(order?.createdAt).format('Do MMM, YY')}</strong>
            </Box>{' '}
            <br />
            <Box component="span" whiteSpace="nowrap">
              at <strong>{dayjs(order?.createdAt).format('h:mm a')},</strong>{' '}
              <strong>
                {order?.items.length} item{Number(order?.items.length) > 1 && 's'}
              </strong>{' '}
              in total
            </Box>
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default OrderHead;
