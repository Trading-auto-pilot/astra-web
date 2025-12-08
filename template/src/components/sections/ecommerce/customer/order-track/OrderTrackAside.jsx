import { useMemo } from 'react';
import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { kebabCase } from 'lib/utils';

const OrderTrackAside = ({ order }) => {
  const orderInfo = useMemo(
    () => [
      {
        label: 'Order number',
        value: order.number,
      },
      {
        label: 'Order date',
        value: dayjs(order.orderDate).format('MMMM DD, YYYY'),
      },
      {
        label: 'Ship date',
        value: dayjs(order.shipDate).format('MMMM DD, YYYY'),
      },
      {
        label: 'Shipping address',
        value: order.shippingAddress,
      },
      {
        label: 'Carrier',
        value: order.carrier,
      },
      {
        label: 'Carrier tracking number',
        value: order.carrierTrackingNumber,
      },
    ],
    [order],
  );

  return (
    <Stack
      direction="column"
      sx={{
        gap: 4,
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
          <strong>{dayjs(order.orderDate).format('MMMM DD, YYYY')}</strong>
          &nbsp;&nbsp;at&nbsp;&nbsp;
          <strong>{dayjs(order.orderDate).format('hh:mm a')}</strong>
        </Typography>
      </div>
      <List dense disablePadding>
        {orderInfo.map(({ label, value }) => (
          <ListItem key={kebabCase(label)} disablePadding disableGutters sx={{ mb: 3 }}>
            <ListItemText
              disableTypography
              sx={{ m: 0 }}
              primary={
                <Stack
                  direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }}
                  sx={{
                    rowGap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      minWidth: 200,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'text.secondary',
                      wordBreak: 'break-word',
                    }}
                  >
                    {String(value)}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default OrderTrackAside;
