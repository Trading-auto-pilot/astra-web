import { useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { statusColorMap } from 'components/sections/ecommerce/customer/order-list/OrderedItem';
import { useOrderDetails } from '../OrderDetailsProvider';
import OrderItem from './OrderItem';

const OrderItems = () => {
  const { order } = useOrderDetails();

  const itemStatusList = useMemo(() => {
    return order?.items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;

      return acc;
    }, {});
  }, [order?.items]);

  return (
    <Paper sx={{ height: 1, p: { xs: 3, md: 5 } }}>
      <Container maxWidth={false} sx={{ maxWidth: 694, px: { xs: 0 } }}>
        <Box sx={{ bgcolor: 'background.elevation1', borderRadius: 2, p: 2, mb: 4 }}>
          <Stack
            sx={{
              gap: 2,
              justifyContent: 'space-between',
              textTransform: 'capitalize',
            }}
          >
            {itemStatusList && (
              <Stack
                sx={{
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: { sm: 'flex-end' },
                }}
              >
                {Object.keys(itemStatusList).map((status) => (
                  <Chip
                    key={status}
                    variant="filled"
                    color={statusColorMap[status]}
                    label={`${itemStatusList[status]} ${status}`}
                  />
                ))}
              </Stack>
            )}
            <Divider flexItem orientation="vertical" sx={{ ml: 'auto' }} />
            <Chip variant="filled" color="warning" label={order?.payment.status} />
          </Stack>
        </Box>

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                bgcolor: order?.status === 'unfulfilled' ? 'warning.lighter' : 'success.lighter',
                borderRadius: 2,
              }}
            >
              <IconifyIcon
                icon={
                  order?.status === 'unfulfilled'
                    ? 'material-symbols:warning-outline-rounded'
                    : 'material-symbols:check-rounded'
                }
                color={order?.status === 'unfulfilled' ? 'warning.main' : 'success.main'}
                fontSize={20}
              />
            </Avatar>

            <Typography variant="h6" textTransform="capitalize">
              {order?.status}
            </Typography>
          </Stack>

          <Button variant="soft" color="neutral">
            Mark as {order?.status === 'fulfilled' ? 'unfulfilled' : 'fulfilled'}
          </Button>
        </Stack>

        <Stack
          direction="column"
          sx={{
            gap: 5,
          }}
        >
          {order?.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

export default OrderItems;
