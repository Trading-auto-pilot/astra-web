import { Box, Paper, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { orderDetailsList } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import OrderDetailsAside from 'components/sections/ecommerce/customer/order-details/OrderDetailsAside';
import OrderedItem from 'components/sections/ecommerce/customer/order-details/OrderedItem';

const OrderDetails = () => {
  const order = orderDetailsList[1];

  return (
    <Grid
      container
      sx={{
        height: 1,
      }}
    >
      <Grid size={12}>
        <PageHeader
          title="Order details"
          userLoggedIn
          breadcrumb={[
            { label: 'home', url: paths.ecommerceHomepage },
            { label: 'order list', url: paths.orderList },
            { label: 'order details', active: true },
          ]}
        />
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 8,
          xl: 9,
        }}
      >
        <Paper sx={{ height: 1, px: { xs: 3, md: 5 }, py: { xs: 5, md: 8 } }}>
          <Stack
            direction="column"
            sx={{
              gap: 8,
            }}
          >
            {order.items.map((product) => (
              <OrderedItem key={product.id} product={product} customer={order.customer} />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
          xl: 3,
        }}
      >
        <Paper background={1} sx={{ height: 1 }}>
          <Box
            sx={(theme) => ({
              position: 'sticky',
              top: theme.mixins.ecommerceTopbar,
              p: { xs: 3, md: 5 },
            })}
          >
            <OrderDetailsAside order={order} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderDetails;
