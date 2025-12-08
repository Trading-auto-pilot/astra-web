import { useEffect } from 'react';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { orderDetailsList } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import OrderDetailsProvider, {
  useOrderDetails,
} from 'components/sections/ecommerce/admin/order/OrderDetailsProvider';
import OrderHead from 'components/sections/ecommerce/admin/order/OrderHead';
import OrderAside from 'components/sections/ecommerce/admin/order/aside';
import OrderContainer from 'components/sections/ecommerce/admin/order/main';

const index = () => {
  return (
    <OrderDetailsProvider>
      <Order />
    </OrderDetailsProvider>
  );
};

const Order = () => {
  const { order, setSetselectedOrder } = useOrderDetails();

  useEffect(() => {
    setSetselectedOrder(orderDetailsList[0]);
  }, []);

  if (!order) {
    return null;
  }

  return (
    <Grid container>
      <Grid
        size={{
          xs: 12,
          md: 8,
          xl: 9,
        }}
      >
        <Stack direction="column">
          <OrderHead
            breadcrumb={[
              { label: 'Order list', url: paths.orderList },
              { label: 'Order', active: true },
            ]}
          />

          <OrderContainer />
        </Stack>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 4,
          xl: 3,
        }}
      >
        <OrderAside />
      </Grid>
    </Grid>
  );
};

export default index;
