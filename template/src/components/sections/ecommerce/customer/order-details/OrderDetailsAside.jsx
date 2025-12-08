import { useMemo } from 'react';
import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { statusColorMap } from '../order-list/OrderedItem';

const OrderDetailsAside = ({ order }) => {
  const { currencyFormat } = useNumberFormat();
  const itemStatusList = useMemo(() => {
    return order.items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;

      return acc;
    }, {});
  }, [order?.items]);

  return (
    <Stack
      direction="column"
      sx={{
        gap: 5,
      }}
    >
      <div>
        <Typography
          variant="h3"
          sx={{
            mb: 1,
          }}
        >
          Order {order.id}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            mb: 1,
          }}
        >
          Placed on &nbsp;&nbsp;
          <strong>{dayjs(order.createdAt).format('MMMM DD, YYYY')}</strong>
          &nbsp;&nbsp;at&nbsp;&nbsp;
          <strong>{dayjs(order.createdAt).format('hh:mm a')}</strong>
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            mb: 3,
          }}
        >
          <strong>{order.items.length} items</strong>&nbsp;&nbsp;in total
        </Typography>

        <Stack
          sx={{
            gap: 1,
            flexWrap: 'wrap',
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
      </div>
      <div>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Customer’s name
        </Typography>
        <Stack
          sx={{
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Avatar
            src={order.customer?.avatar}
            alt="Captain Haddock"
            sx={{ width: 27, height: 27 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            {order.customer?.name}
          </Typography>
        </Stack>
      </div>
      <div>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Payment status
        </Typography>
        <Stack
          sx={{
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Standard DDP
          </Typography>
          <Chip
            variant="soft"
            color={order.payment.status === 'unpaid' ? 'error' : 'success'}
            label={order.payment.status}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        </Stack>
      </div>
      <Stack direction="column" divider={<Divider sx={{ my: 3 }} />}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
          }}
        >
          Summary
        </Typography>

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            Subtotal
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {currencyFormat(order.payment.subtotal)}
          </Typography>
        </Stack>

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            Shipping cost
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {currencyFormat(order.payment.shippingCost)}
          </Typography>
        </Stack>

        <Stack
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            Discount
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
            }}
          >
            {currencyFormat(order.payment.discount)}
          </Typography>
        </Stack>

        <Box sx={{ textAlign: 'right' }}>
          <Stack
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
              }}
            >
              Total
            </Typography>
            <Typography variant="h4">{currencyFormat(order.payment.total)}</Typography>
          </Stack>

          <Chip
            color="success"
            variant="filled"
            label="saved 46% in total"
            sx={{ textAlign: 'right' }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default OrderDetailsAside;
