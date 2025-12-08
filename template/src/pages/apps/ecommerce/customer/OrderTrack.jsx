import { Box, Container, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { orderTrackDetails } from 'data/e-commerce/orders';
import paths from 'routes/paths';
import Mapbox from 'components/base/Mapbox';
import PageHeader from 'components/sections/ecommerce/customer/common/PageHeader';
import OrderStatusInfoTable from 'components/sections/ecommerce/customer/order-track/OrderStatusInfoTable';
import OrderTrackAside from 'components/sections/ecommerce/customer/order-track/OrderTrackAside';
import OrderTrackStepper from 'components/sections/ecommerce/customer/order-track/OrderTrackStepper';

const OrderTrack = () => {
  const order = orderTrackDetails;

  return (
    <Grid container>
      <Grid size={12}>
        <PageHeader
          title="Track order"
          userLoggedIn
          breadcrumb={[
            { label: 'Order', url: paths.orderList },
            { label: 'Order track', active: true },
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
          <Container maxWidth="md" sx={{ px: { xs: 0 } }}>
            <Mapbox
              sx={{ bgcolor: 'background.elevation1', borderRadius: 4, mb: 2 }}
              options={{
                center: [-118.4782382, 34.1917607],
                zoom: 14,
                scrollZoom: false,
              }}
            />
            <OrderTrackStepper steps={order.trackSteps} sx={{ mb: 5 }} />
            <OrderStatusInfoTable data={order.tracks} />
          </Container>
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
            <OrderTrackAside order={order} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderTrack;
